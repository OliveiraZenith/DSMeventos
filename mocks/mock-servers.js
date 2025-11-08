// DSMeventos-web-app/mocks/mock-servers.js

const express = require('express');

// --- Mock do Auth Service (Equipe 1) ---
const authApp = express();
authApp.use(express.json());
const AUTH_PORT = 3001; 

// POST /auth/login (Rota Pública - simula sucesso e retorna um token falso)
authApp.post('/auth/login', (req, res) => {
    // Apenas para simular a resposta, você pode retornar qualquer JWT_SECRET
    const MOCK_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImlhdCI6MTUxNjIzOTAyMn0.k0Xo0hYQW3Q5E5e_8S5hP7I_y5dYk4tE_rB-v_8I_Yc";
    res.json({ token: MOCK_TOKEN, message: 'Login realizado com sucesso! (MOCK)' });
});

// GET /users/me (Rota Protegida - simula o dado do usuário)
authApp.get('/users/me', (req, res) => {
    // Note que aqui o Auth Service nunca validaria o token, o Gateway faz isso!
    res.json({ 
        id: '123', 
        email: 'teste@mock.com', 
        message: 'Dados do usuário logado (MOCK Auth Service)',
        service_checked: true
    });
});

authApp.listen(AUTH_PORT, () => console.log(`[MOCK] Auth Service rodando na porta ${AUTH_PORT}`));

// --- Mock do Events Service (Equipe 2) ---
const eventsApp = express();
eventsApp.use(express.json());
const EVENTS_PORT = 3002; 

// GET /events (Rota Pública)
eventsApp.get('/events', (req, res) => {
    res.json([{ id: 1, title: 'Evento Mockado', service_checked: true }]);
});

// POST /events (Rota Protegida)
eventsApp.post('/events', (req, res) => {
    res.status(201).json({ id: 2, title: 'Evento Criado (MOCK)', service_checked: true });
});

eventsApp.listen(EVENTS_PORT, () => console.log(`[MOCK] Events Service rodando na porta ${EVENTS_PORT}`));


// --- Mock do Orders Service (Equipe 3) ---
const ordersApp = express();
ordersApp.use(express.json());
const ORDERS_PORT = 3003; 

// POST /orders/subscribe (Rota Protegida)
ordersApp.post('/orders/subscribe', (req, res) => {
    res.status(201).json({ subscriptionId: 'S-1', eventId: req.body.eventId, message: 'Inscrição realizada (MOCK)', service_checked: true });
});

ordersApp.listen(ORDERS_PORT, () => console.log(`[MOCK] Orders Service rodando na porta ${ORDERS_PORT}`));