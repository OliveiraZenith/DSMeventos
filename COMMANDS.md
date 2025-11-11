# DSMeventos - Quick Command Reference

## 🚀 Quick Start

### First Time Setup
```bash
# 1. Install dependencies
make install

# 2. Copy and configure environment
cp .env.docker .env
# Edit .env with your values

# 3. Build Docker images
make docker-build

# 4. Start services
make up
```

### Daily Development

**Using Make (Recommended):**
```bash
make docker-dev        # Start in development mode
make logs              # View logs
make down              # Stop services
```

**Using npm:**
```bash
npm run dev:all        # Local development (no Docker)
npm run docker:dev     # Docker development mode
```

## 📋 Command Cheat Sheet

### Docker Commands

| Task | Make Command | npm Command | Docker Compose |
|------|--------------|-------------|----------------|
| Build all | `make docker-build` | `npm run docker:build` | `docker-compose build` |
| Build Gateway | `make docker-build-gw` | `npm run docker:build:gateway` | `docker-compose build api-gateway` |
| Build Frontend | `make docker-build-fe` | `npm run docker:build:frontend` | `docker-compose build frontend` |
| Start (prod) | `make up` | `npm run docker:up` | `docker-compose up -d` |
| Start (dev) | `make docker-dev` | `npm run docker:dev` | `docker-compose -f docker-compose.dev.yml up` |
| Stop | `make down` | `npm run docker:down` | `docker-compose down` |
| View logs | `make logs` | `npm run docker:logs` | `docker-compose logs -f` |
| Restart | `make restart` | - | `docker-compose restart` |
| Clean up | `make docker-clean` | - | `docker-compose down -v` |

### Local Development (No Docker)

| Task | Make Command | npm Command |
|------|--------------|-------------|
| Install all | `make install` | - |
| Build all | `make build` | `npm run build:all` |
| Build Frontend | `make build-frontend` | `npm run build:frontend` |
| Dev (Mocks + Gateway) | `make dev` | `npm run dev` |
| Dev (All services) | `make dev-all` | `npm run dev:all` |
| Start Gateway | `make start-gateway` | `npm run start:gateway` |
| Start Frontend | `make start-frontend` | `npm run start:frontend` |
| Start Mocks | `make start-mocks` | `npm run start:mocks` |
| Clean | `make clean` | - |

### Individual Service Logs

| Service | Make Command | Docker Compose |
|---------|--------------|----------------|
| Gateway logs | `make docker-logs-gw` | `docker-compose logs -f api-gateway` |
| Frontend logs | `make docker-logs-fe` | `docker-compose logs -f frontend` |
| Both services | `make logs` | `docker-compose logs -f` |

## 🔍 Troubleshooting Commands

```bash
# Check what's running
docker-compose ps
docker ps

# Check resource usage
docker stats

# Test endpoints
curl http://localhost:4000/     # Gateway health
curl http://localhost:3000/     # Frontend

# View last 50 log lines
docker-compose logs --tail=50 api-gateway
docker-compose logs --tail=50 frontend

# Shell into container
docker-compose exec api-gateway sh
docker-compose exec frontend sh

# Full restart
make down && make docker-build && make up

# Nuclear option - clean everything
docker-compose down -v
docker system prune -af
```

## 🌐 Service URLs

| Service | Development | Production (Docker) |
|---------|-------------|---------------------|
| Frontend | http://localhost:3000 | http://localhost:3000 |
| API Gateway | http://localhost:4000 | http://localhost:4000 |
| Mock Auth | http://localhost:3001 | - |
| Mock Events | http://localhost:3002 | - |
| Mock Orders | http://localhost:3003 | - |

## 📝 Environment Variables

### Required for API Gateway
- `JWT_SECRET` - Secret for JWT signing/verification
- `AUTH_SERVICE_URL` - Authentication service endpoint
- `EVENTS_SERVICE_URL` - Events service endpoint
- `ORDERS_SERVICE_URL` - Orders service endpoint

### Required for Frontend
- `NEXT_PUBLIC_API_URL` - Public API Gateway URL

## 🎯 Common Workflows

### Starting Fresh
```bash
make docker-clean      # Clean everything
make docker-build      # Rebuild images
make up                # Start services
```

### Update Code and Restart
```bash
# Development mode (auto-reload)
make docker-dev

# Production mode (manual restart)
make restart
```

### Check Service Health
```bash
make docker-ps         # Check status
curl http://localhost:4000/  # Test Gateway
curl http://localhost:3000/  # Test Frontend
```

### View Logs in Real-Time
```bash
make logs              # All services
make docker-logs-gw    # Gateway only
make docker-logs-fe    # Frontend only
```

## 💡 Tips

- **Use Make commands** for simplicity: `make help` shows all options
- **Development mode** watches for file changes (use `docker-dev`)
- **Production mode** optimized for performance (use `up`)
- **Clean regularly** to free up disk space: `make docker-clean`
- **Check logs first** when debugging: `make logs`
- Services run **independently** - you can start/stop them separately

## 🆘 Need Help?

```bash
make help              # Show all Make commands
npm run                # Show all npm scripts
docker-compose --help  # Docker Compose help
```
