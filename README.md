# 🎟️ DSMEventos - Sistema de Gerenciamento de Eventos

## 👥 Equipe 4 - Frontend & API Gateway

- **Marcos Landi**  
- **Ana Laura**  
- **Eduardo**  
- **Héricles Mendes**  
- **Guilherme de Araújo**  
- **Raul Gonçalves**

---

## 📝 Sobre o Projeto

Sistema de gerenciamento de eventos desenvolvido em arquitetura de microserviços, composto por:

### 🧩 API Gateway
Servidor **Node.js/Express** que atua como ponto de entrada único do sistema:
- Validação de **JWT** de autenticação
- Roteamento de requisições para os microserviços corretos
- Gerenciamento centralizado de segurança
- Proxy inteligente para serviços backend
- Suporte a serviços mockados para desenvolvimento

### 🎨 Frontend
Interface desenvolvida em **Next.js** que consome apenas o API Gateway:
- Interface intuitiva e responsiva
- Experiência de usuário otimizada
- Design moderno com Tailwind CSS

### 🔄 Integração com Serviços Backend

**Serviços Operacionais**:
- ✅ **Auth Service**: Autenticação e gerenciamento de usuários (https://dsm-eventos-authservice.onrender.com)
- ✅ **Event Service**: Gerenciamento completo de eventos (https://dsmeventos-events-service.onrender.com)

**Serviços em Desenvolvimento** (usando mocks):
- 🔄 **Notification Service**: Sistema de notificações
- 🔄 **Orders Service**: Gerenciamento de inscrições em eventos

---

## 🛠️ Tecnologias

- **Frontend:** Next.js, React, Tailwind CSS
- **API Gateway:** Node.js, Express
- **Containerização:** Docker, Docker Compose
- **Deploy:** Render

---

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+
- Docker & Docker Compose (opcional)
- Git

### Instalação Local

#### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/DSMeventos.git
cd DSMeventos
```

#### 2. Instale as dependências
```bash
# API Gateway
cd api-gateway
npm install

# Frontend
cd ../frontend
npm install
```

#### 3. Configure as variáveis de ambiente
```bash
# API Gateway
cd api-gateway
cp .env.example .env
# Edite o .env se necessário (os valores padrão já apontam para os serviços em produção)

# Frontend
cd ../frontend
cp .env.example .env
# Configure NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### 4. Execute o projeto

**Executar API Gateway:**
```bash
cd api-gateway
npm run dev
# Rodando em http://localhost:5000
```

**Executar Frontend** (em outro terminal):
```bash
cd frontend
npm run dev
# Rodando em http://localhost:3000
```

### 🐳 Usando Docker

#### Desenvolvimento
```bash
# Build e start
make docker-build
make docker-dev

# OU com npm
npm run docker:build
npm run docker:dev
```

#### Produção
```bash
make docker-build
make up

# Verificar logs
make logs

# Parar serviços
make down
```

---

## 📦 Comandos Disponíveis

### Make (Mais Fácil)

```bash
make help           # Mostrar todos os comandos

# Desenvolvimento Local
make install        # Instalar dependências
make dev            # Mocks + Gateway
make dev-all        # Todos os serviços
make build          # Build local
make clean          # Limpar artefatos

# Docker
make docker-build   # Build das imagens
make docker-dev     # Modo desenvolvimento
make up             # Iniciar (produção)
make down           # Parar serviços
make logs           # Ver logs
make restart        # Reiniciar serviços
```

### npm Scripts

```bash
# Desenvolvimento
npm run dev                # Mocks + Gateway
npm run dev:all           # Todos os serviços
npm run start:gateway     # Apenas Gateway
npm run start:frontend    # Apenas Frontend
npm run start:mocks       # Apenas Mocks

# Build
npm run build:all         # Build de tudo
npm run build:frontend    # Build do Frontend

# Docker
npm run docker:build      # Build das imagens
npm run docker:dev        # Modo desenvolvimento
npm run docker:up         # Iniciar containers
npm run docker:down       # Parar containers
npm run docker:logs       # Ver logs
```

### Docker Compose Direto

```bash
# Build
docker-compose build
docker-compose build api-gateway
docker-compose build frontend

# Executar
docker-compose up -d
docker-compose -f docker-compose.dev.yml up

# Gerenciar
docker-compose ps
docker-compose logs -f
docker-compose down
docker-compose restart

# Limpar
docker-compose down -v
```

---

## 🌐 URLs dos Serviços

| Serviço | Desenvolvimento | Produção |
|---------|----------------|----------|
| Frontend | http://localhost:3000 | https://dsmeventos-frontend.onrender.com |
| API Gateway | http://localhost:5000 | https://dsmeventos-api-gateway.onrender.com |
| Auth Service | https://dsm-eventos-authservice.onrender.com | (mesmo) |
| Event Service | https://dsmeventos-events-service.onrender.com | (mesmo) |

**Nota**: Os mocks locais não são mais necessários, pois os serviços reais estão operacionais.

---

## ⚙️ Variáveis de Ambiente

### API Gateway (api-gateway/.env)
```env
# Configuração do Servidor
PORT=5000
NODE_ENV=development

# Configuração JWT (deve coincidir com o Auth Service)
JWT_SECRET=8TxBUpTP0MGfXm6KeAt8
JWT_EXPIRES_IN=1h

# Configuração CORS
CORS_ORIGIN=http://localhost:3000

# URLs dos Microserviços Backend
# Auth Service (OPERACIONAL - NÃO MOCKAR)
AUTH_SERVICE_URL=https://dsm-eventos-authservice.onrender.com

# Event Service (OPERACIONAL - NÃO MOCKAR)
EVENTS_SERVICE_URL=https://dsmeventos-events-service.onrender.com

# Notification Service (ainda não disponível - usando mocks)
NOTIFICATION_SERVICE_URL=

# Orders Service (ainda não disponível - usando mocks)
ORDERS_SERVICE_URL=

# Configuração de Mocks
USE_MOCKS=false
```

### Frontend (frontend/.env)
```env
# URL do API Gateway
NEXT_PUBLIC_API_URL=http://localhost:5000

# Ambiente
NEXT_PUBLIC_ENV=development
```

⚠️ **Importante**: 
- A variável `NEXT_PUBLIC_API_URL` deve estar disponível em **tempo de build** para o Next.js
- O `JWT_SECRET` deve ser o mesmo no API Gateway e no Auth Service
- Use `PORT=5000` para o API Gateway (padrão atualizado)

---

## 🚢 Deploy no Render

### Opção 1: Blueprint (Recomendado)

1. **Faça push para o GitHub:**
```bash
git add .
git commit -m "Deploy para Render"
git push origin main
```

2. **No Render:**
   - Acesse [render.com](https://render.com)
   - Clique em "New" → "Blueprint"
   - Conecte seu repositório GitHub
   - Selecione o arquivo `render.yaml`
   - Clique em "Apply"

3. **Configure as variáveis:**
   - **API Gateway**: Configure URLs dos microserviços
   - **Frontend**: Configure `NEXT_PUBLIC_API_URL` com a URL do Gateway

### Opção 2: Deploy Manual

#### Deploy do API Gateway

1. Crie um novo Web Service
2. Configure:
   - **Nome**: `dsmeventos-api-gateway`
   - **Root Directory**: `api-gateway`
   - **Environment**: `Docker`
   - **Dockerfile**: `./Dockerfile`

3. Adicione variáveis de ambiente:
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=8TxBUpTP0MGfXm6KeAt8
JWT_EXPIRES_IN=1h
CORS_ORIGIN=<url_do_frontend>
AUTH_SERVICE_URL=https://dsm-eventos-authservice.onrender.com
EVENTS_SERVICE_URL=https://dsmeventos-events-service.onrender.com
NOTIFICATION_SERVICE_URL=
ORDERS_SERVICE_URL=
USE_MOCKS=false
```

#### Deploy do Frontend

1. Crie um novo Web Service
2. Configure:
   - **Nome**: `dsmeventos-frontend`
   - **Root Directory**: `frontend`
   - **Environment**: `Docker`
   - **Dockerfile**: `./Dockerfile`

3. Adicione variáveis de ambiente:
```env
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_URL=https://dsmeventos-api-gateway.onrender.com
```

⚠️ **Ordem de Deploy**: Deploy o Gateway primeiro, depois o Frontend!

### Testar Deploy Local

Antes de fazer deploy, teste as builds Docker localmente:

```bash
# Gateway
cd api-gateway
docker build -t test-gateway .
docker run -p 4000:4000 -e JWT_SECRET=test test-gateway

# Frontend
cd frontend
docker build --build-arg NEXT_PUBLIC_API_URL=http://localhost:4000 -t test-frontend .
docker run -p 3000:3000 test-frontend
```

---

## 🔍 Troubleshooting

### Porta já em uso
```bash
# Encontrar processo usando a porta
lsof -ti:3000
lsof -ti:4000

# Matar processo
kill -9 $(lsof -ti:3000)
```

### Container não inicia
```bash
# Ver logs
make logs
docker-compose logs api-gateway
docker-compose logs frontend

# Reconstruir do zero
make docker-clean
make docker-build
make up
```

### Frontend não conecta ao Gateway
1. Verifique se `NEXT_PUBLIC_API_URL` está correto
2. Confirme que o Gateway está rodando: `curl http://localhost:4000/`
3. Verifique erros de CORS no console do navegador

### Build do Docker falha
```bash
# Limpar cache e reconstruir
docker-compose build --no-cache
```

---

## 📁 Estrutura do Projeto

```
DSMeventos/
├── api-gateway/          # API Gateway (Node.js/Express)
│   ├── server.js
│   ├── Dockerfile
│   └── package.json
├── frontend/             # Frontend (Next.js)
│   ├── app/
│   ├── pages/
│   ├── Dockerfile
│   └── package.json
├── mocks/                # Servidores mock para desenvolvimento
├── docker-compose.yml    # Configuração Docker produção
├── docker-compose.dev.yml # Configuração Docker desenvolvimento
├── render.yaml           # Configuração para deploy no Render
├── Makefile              # Comandos facilitados
└── README.md             # Este arquivo
```

---

## 🔐 Segurança

### Boas Práticas

1. **Nunca commite arquivos `.env`**
2. **Use segredos fortes** para `JWT_SECRET`
3. **Configure CORS** apropriadamente no Gateway
4. **Use HTTPS** em produção
5. **Mantenha dependências atualizadas**: `npm audit fix`

---

## 🧪 Testes

```bash
# Verificar saúde dos serviços
curl http://localhost:4000/  # Gateway
curl http://localhost:3000/  # Frontend

# Verificar uso de recursos
docker stats

# Verificar status dos containers
docker-compose ps
```

---

## 📚 Recursos Adicionais

- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Express](https://expressjs.com/)
- [Documentação Docker](https://docs.docker.com/)
- [Documentação Render](https://render.com/docs)

---

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs: `make logs`
2. Consulte a seção de Troubleshooting acima
3. Revise as variáveis de ambiente
4. Verifique se todas as portas estão livres
5. Tente reconstruir do zero: `make docker-clean && make docker-build && make up`

---

## 📝 Notas de Desenvolvimento

### Finais de Linha (LF / CRLF)

O repositório usa `.gitattributes` para normalizar finais de linha para LF. No Windows, configure:

```bash
git config --global core.autocrlf true
```

### Tier Gratuito do Render

- Serviços dormem após 15 minutos de inatividade
- Primeira requisição após dormir leva ~30 segundos
- 750 horas/mês compartilhadas entre todos os serviços

---

## 📄 Licença

Este projeto é parte do curso de Desenvolvimento de Software Multiplataforma e é destinado apenas para fins educacionais.

