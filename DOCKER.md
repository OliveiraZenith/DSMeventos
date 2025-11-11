# Docker Setup for DSMeventos

This guide explains how to run the API Gateway and Frontend using Docker.

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- (Optional) Make utility for simplified commands

## 🚀 Quick Start

### Using Make (Recommended)

```bash
# Build and start all services
make docker-build
make docker-up

# Or use shortcuts
make up
```

### Using npm scripts

```bash
# Build all services
npm run build:all

# Docker commands
npm run docker:build
npm run docker:up
```

### Using Docker Compose directly

1. **Copy environment variables:**
   ```bash
   cp .env.docker .env
   ```

2. **Edit `.env` file with your actual values:**
   - Set a strong `JWT_SECRET`
   - Configure your microservices URLs
   - Set the frontend API URL

3. **Build and run:**
   ```bash
   docker-compose up -d
   ```

4. **Access the applications:**
   - Frontend: http://localhost:3000
   - API Gateway: http://localhost:4000

### Development Mode

**Using Make:**
```bash
make docker-dev
```

**Using npm:**
```bash
npm run docker:dev
```

**Using Docker Compose:**
```bash
docker-compose -f docker-compose.dev.yml up
```

## 🛠️ Available Commands

### Make Commands (Easiest)

```bash
# Help menu
make help

# Local Development
make install          # Install all dependencies
make build            # Build all services locally
make dev              # Run mocks + gateway
make dev-all          # Run mocks + gateway + frontend
make clean            # Clean build artifacts

# Docker - Build
make docker-build     # Build all Docker images
make docker-build-gw  # Build API Gateway only
make docker-build-fe  # Build Frontend only

# Docker - Run
make docker-up        # Start all services (production)
make docker-dev       # Start all services (development)
make docker-down      # Stop all services
make docker-restart   # Restart all services

# Docker - Logs
make docker-logs      # View all logs
make docker-logs-gw   # View Gateway logs
make docker-logs-fe   # View Frontend logs

# Docker - Cleanup
make docker-clean     # Remove containers and volumes

# Shortcuts
make up              # Same as docker-up
make down            # Same as docker-down
make logs            # Same as docker-logs
```

### npm Scripts

```bash
# Local Development
npm run start:frontend       # Start frontend dev server
npm run start:gateway        # Start gateway dev server
npm run start:mocks          # Start mock servers
npm run dev                  # Run mocks + gateway
npm run dev:all              # Run all services

# Build
npm run build:frontend       # Build frontend
npm run build:gateway        # Install gateway dependencies
npm run build:all            # Build all services

# Docker
npm run docker:build         # Build Docker images
npm run docker:build:gateway # Build Gateway image
npm run docker:build:frontend # Build Frontend image
npm run docker:up            # Start Docker services
npm run docker:down          # Stop Docker services
npm run docker:logs          # View logs
npm run docker:dev           # Start in dev mode
```

### Docker Compose Commands
### Docker Compose Commands

```bash
# Build Services
docker-compose build                    # Build all
docker-compose build api-gateway        # Build Gateway only
docker-compose build frontend           # Build Frontend only
docker-compose build --no-cache         # Build without cache

# Start/Stop Services
docker-compose up -d                    # Start all (detached)
docker-compose up -d api-gateway        # Start Gateway only
docker-compose up -d frontend           # Start Frontend only
docker-compose down                     # Stop all
docker-compose down -v                  # Stop and remove volumes
docker-compose restart                  # Restart all
docker-compose restart api-gateway      # Restart Gateway only

# View Logs
docker-compose logs -f                  # All logs (follow)
docker-compose logs -f api-gateway      # Gateway logs
docker-compose logs -f frontend         # Frontend logs
docker-compose logs --tail=100 frontend # Last 100 lines

# Service Management
docker-compose ps                       # List running services
docker-compose top                      # View running processes
docker-compose exec api-gateway sh      # Shell into Gateway
docker-compose exec frontend sh         # Shell into Frontend

# Cleanup
docker-compose rm -f                    # Remove stopped containers
docker-compose down --rmi all           # Remove containers and images
docker system prune -a                  # Clean all unused Docker resources
```

## 🔍 Health Checks

Both services have health checks configured:

```bash
# Check health status
docker-compose ps
```

## 📦 Individual Service Builds

### API Gateway

**Build and run standalone:**
```bash
cd api-gateway

# Build production image
docker build -t dsmeventos-api-gateway:latest .

# Build with specific target
docker build --target production -t dsmeventos-api-gateway:prod .
docker build --target development -t dsmeventos-api-gateway:dev .

# Run standalone container
docker run -d -p 4000:4000 \
  --name api-gateway \
  -e JWT_SECRET=your_secret \
  -e AUTH_SERVICE_URL=http://localhost:3001 \
  -e EVENTS_SERVICE_URL=http://localhost:3002 \
  -e ORDERS_SERVICE_URL=http://localhost:3003 \
  dsmeventos-api-gateway:latest

# View logs
docker logs -f api-gateway

# Stop and remove
docker stop api-gateway && docker rm api-gateway
```

### Frontend

**Build and run standalone:**
```bash
cd frontend

# Build production image
docker build -t dsmeventos-frontend:latest .

# Build with build arguments
docker build \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:4000 \
  -t dsmeventos-frontend:latest .

# Run standalone container
docker run -d -p 3000:3000 \
  --name frontend \
  -e NEXT_PUBLIC_API_URL=http://localhost:4000 \
  dsmeventos-frontend:latest

# View logs
docker logs -f frontend

# Stop and remove
docker stop frontend && docker rm frontend
```

## 🔄 Common Workflows

### Full Rebuild

```bash
# Stop everything
make down

# Clean everything
make docker-clean

# Rebuild from scratch
make docker-build

# Start fresh
make up
```

### Update Single Service

```bash
# Rebuild and restart Gateway
docker-compose build api-gateway
docker-compose up -d api-gateway

# Or with Make
make docker-build-gw
make up
```

### Check Service Health

```bash
# Check container status
docker-compose ps

# Check Gateway health
curl http://localhost:4000/

# Check Frontend health
curl http://localhost:3000/

# View resource usage
docker stats
```

## 🔧 Troubleshooting

### Port Already in Use
If ports 3000 or 4000 are already in use, modify the port mappings in `docker-compose.yml`:
```yaml
ports:
  - "8080:4000"  # Change host port (left side)
```

### Container Won't Start
```bash
# Check logs
docker-compose logs api-gateway

# Inspect container
docker inspect dsmeventos-api-gateway
```

### Clean Rebuild
```bash
# Remove everything and start fresh
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Frontend Build Issues
If the frontend fails to build, ensure your `next.config.ts` has `output: 'standalone'`:
```typescript
const nextConfig: NextConfig = {
  output: 'standalone',
};
```

## 🏗️ Multi-Stage Build Benefits

Both Dockerfiles use multi-stage builds for:
- ✅ Smaller production images
- ✅ Better layer caching
- ✅ Separate dev and prod configurations
- ✅ Enhanced security (non-root user)
- ✅ Optimized for Next.js standalone output

## 📊 Image Sizes

Expected image sizes:
- **API Gateway**: ~150MB (Alpine-based)
- **Frontend**: ~180MB (with Next.js standalone)

## 🔐 Security Notes

1. **Always change default secrets** in production
2. **Don't commit `.env`** files (use `.env.example` for templates)
3. **Use Docker secrets** for sensitive data in production
4. **Keep base images updated**: `docker-compose pull`

## 🌐 Network Configuration

Services communicate through a Docker bridge network (`dsmeventos-network`):
- Services can reach each other by service name
- External access through mapped ports

## 📝 Environment Variables

### API Gateway
- `PORT`: Server port (default: 4000)
- `JWT_SECRET`: Secret for JWT validation
- `AUTH_SERVICE_URL`: Authentication service endpoint
- `EVENTS_SERVICE_URL`: Events service endpoint
- `ORDERS_SERVICE_URL`: Orders service endpoint
- `NODE_ENV`: Environment mode

### Frontend
- `PORT`: Server port (default: 3000)
- `NEXT_PUBLIC_API_URL`: Public API Gateway URL
- `NODE_ENV`: Environment mode

## 🚢 Production Deployment

For production deployment:

1. Use secrets management (Docker Swarm secrets, Kubernetes secrets)
2. Configure reverse proxy (nginx, traefik)
3. Set up SSL/TLS certificates
4. Configure logging drivers
5. Set resource limits in docker-compose.yml:

```yaml
deploy:
  resources:
    limits:
      cpus: '1'
      memory: 512M
    reservations:
      cpus: '0.5'
      memory: 256M
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
