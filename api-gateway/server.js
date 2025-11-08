// DSMeventos-web-app/api-gateway/server.js

const express = require('express');
const dotenv = require('dotenv');
// Usado para redirecionar requisições para outros servidores
const { createProxyMiddleware } = require('http-proxy-middleware'); 
const jwt = require('jsonwebtoken'); // Para validar o token
const cors = require('cors');

// 1. Carrega as variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares gerais
app.use(cors());
app.use(express.json()); // necessário para parse de bodies JSON

// Simple request logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// Validate required environment variables at startup (warning only)
const requiredEnv = ['AUTH_SERVICE_URL', 'EVENTS_SERVICE_URL', 'ORDERS_SERVICE_URL', 'JWT_SECRET'];
requiredEnv.forEach((name) => {
    if (!process.env[name]) {
        console.warn(`Warning: variável de ambiente ${name} não definida.`);
    }
});

// 2. Middleware de Autenticação (Validação do JWT)
const authMiddleware = (req, res, next) => {
    // Rotas públicas que não precisam de token
    if (
        req.path.startsWith('/auth/login') ||
        req.path.startsWith('/auth/register') ||
        (req.path.startsWith('/events') && req.method === 'GET')
    ) {
        return next();
    }

    // Tenta obter o token do cabeçalho 'Authorization: Bearer <token>'
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
        return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }

    try {
        // Em ambiente de desenvolvimento, permitindo pular a verificação caso JWT_SECRET não esteja configurado
        if (!process.env.JWT_SECRET) {
            console.warn('JWT_SECRET não definido — pulando verificação do token (dev).');
            req.userId = null;
            return next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id || decoded.sub || null;
        next();
    } catch (error) {
        console.error('Falha ao validar token:', error.message);
        return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
};

// 3. Aplica o middleware a TODAS as requisições
app.use(authMiddleware);

// Helper para criar proxies com tratamento de erro
const createServiceProxy = (path, target) => {
    if (!target) {
        console.warn(`Proxy para ${path} não configurado (target vazio).`);
    }
    return createProxyMiddleware({
        target: target || 'http://localhost:0000',
        changeOrigin: true,
        onError: (err, req, res) => {
            console.error(`Erro no proxy para ${path}:`, err && err.message ? err.message : err);
            if (!res.headersSent) {
                res.status(502).json({ error: 'Bad Gateway', details: err && err.message });
            }
        }
    });
};

// 4. Configuração dos Proxies (Redirecionamento para os Microserviços)
app.use(['/auth', '/users'], createServiceProxy('/auth', process.env.AUTH_SERVICE_URL));
app.use('/events', createServiceProxy('/events', process.env.EVENTS_SERVICE_URL));
app.use('/orders', createServiceProxy('/orders', process.env.ORDERS_SERVICE_URL));

// Rota de saúde para verificar se o Gateway está rodando
app.get('/', (req, res) => {
    res.json({ status: 'API Gateway DSMeventos está online!', env: process.env.NODE_ENV || 'development' });
});

app.listen(PORT, () => {
    console.log(`API Gateway rodando em http://localhost:${PORT}`);
    console.log(`Rotas protegidas estão ativas.`);
});