# Docker Setup for DSMeventos

This guide explains how to run the API Gateway and Frontend using Docker.

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## 🚀 Quick Start

### Production Mode

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

1. **Run in development mode with hot reload:**
   ```bash
   docker-compose -f docker-compose.dev.yml up
   ```

2. **Your code changes will be reflected automatically** (volumes are mounted)

## 🛠️ Docker Commands

### Build Services
```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build api-gateway
docker-compose build frontend

# Build without cache
docker-compose build --no-cache
```

### Start/Stop Services
```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d api-gateway

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### View Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api-gateway
docker-compose logs -f frontend
```

### Service Management
```bash
# Restart a service
docker-compose restart api-gateway

# Stop a service
docker-compose stop frontend

# Remove containers
docker-compose rm -f
```

## 🔍 Health Checks

Both services have health checks configured:

```bash
# Check health status
docker-compose ps
```

## 📦 Individual Service Builds

### API Gateway
```bash
cd api-gateway

# Build production image
docker build -t dsmeventos-api-gateway:latest .

# Run standalone
docker run -p 4000:4000 \
  -e JWT_SECRET=your_secret \
  -e AUTH_SERVICE_URL=http://localhost:3001 \
  -e EVENTS_SERVICE_URL=http://localhost:3002 \
  -e ORDERS_SERVICE_URL=http://localhost:3003 \
  dsmeventos-api-gateway:latest
```

### Frontend
```bash
cd frontend

# Build production image
docker build -t dsmeventos-frontend:latest .

# Run standalone
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:4000 \
  dsmeventos-frontend:latest
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
