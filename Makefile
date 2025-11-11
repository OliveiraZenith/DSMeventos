.PHONY: help install build dev clean docker-build docker-up docker-down docker-logs docker-clean

# Default target
help:
	@echo "DSMeventos - Available Commands"
	@echo "================================"
	@echo ""
	@echo "Local Development:"
	@echo "  make install          - Install all dependencies"
	@echo "  make build           - Build all services"
	@echo "  make dev             - Run mocks and gateway in development mode"
	@echo "  make dev-all         - Run mocks, gateway, and frontend"
	@echo "  make clean           - Clean node_modules and build artifacts"
	@echo ""
	@echo "Docker Commands:"
	@echo "  make docker-build    - Build all Docker images"
	@echo "  make docker-build-gw - Build API Gateway Docker image"
	@echo "  make docker-build-fe - Build Frontend Docker image"
	@echo "  make docker-up       - Start all services in Docker (production)"
	@echo "  make docker-dev      - Start all services in Docker (development)"
	@echo "  make docker-down     - Stop all Docker services"
	@echo "  make docker-logs     - View Docker logs"
	@echo "  make docker-clean    - Stop and remove all Docker containers/volumes"
	@echo "  make docker-restart  - Restart all Docker services"
	@echo ""
	@echo "Individual Services:"
	@echo "  make start-gateway   - Start API Gateway only"
	@echo "  make start-frontend  - Start Frontend only"
	@echo "  make start-mocks     - Start Mock servers only"

# Local Development
install:
	@echo "Installing root dependencies..."
	npm install
	@echo "Installing API Gateway dependencies..."
	cd api-gateway && npm install
	@echo "Installing Frontend dependencies..."
	cd frontend && npm install
	@echo "✓ All dependencies installed"

build:
	@echo "Building all services..."
	npm run build:all
	@echo "✓ Build complete"

build-frontend:
	@echo "Building Frontend..."
	npm run build:frontend
	@echo "✓ Frontend build complete"

dev:
	npm run dev

dev-all:
	npm run dev:all

start-gateway:
	npm run start:gateway

start-frontend:
	npm run start:frontend

start-mocks:
	npm run start:mocks

clean:
	@echo "Cleaning build artifacts and node_modules..."
	rm -rf node_modules
	rm -rf api-gateway/node_modules
	rm -rf frontend/node_modules
	rm -rf frontend/.next
	rm -rf frontend/out
	@echo "✓ Cleanup complete"

# Docker Commands
docker-build:
	@echo "Building Docker images..."
	docker-compose build
	@echo "✓ Docker images built"

docker-build-gw:
	@echo "Building API Gateway Docker image..."
	docker-compose build api-gateway
	@echo "✓ API Gateway image built"

docker-build-fe:
	@echo "Building Frontend Docker image..."
	docker-compose build frontend
	@echo "✓ Frontend image built"

docker-up:
	@echo "Starting Docker services (production)..."
	docker-compose up -d
	@echo "✓ Services started"
	@echo "Frontend: http://localhost:3000"
	@echo "API Gateway: http://localhost:4000"

docker-dev:
	@echo "Starting Docker services (development)..."
	docker-compose -f docker-compose.dev.yml up
	@echo "✓ Services started in dev mode"

docker-down:
	@echo "Stopping Docker services..."
	docker-compose down
	@echo "✓ Services stopped"

docker-logs:
	docker-compose logs -f

docker-logs-gw:
	docker-compose logs -f api-gateway

docker-logs-fe:
	docker-compose logs -f frontend

docker-clean:
	@echo "Cleaning Docker resources..."
	docker-compose down -v
	docker system prune -f
	@echo "✓ Docker cleanup complete"

docker-restart:
	@echo "Restarting Docker services..."
	docker-compose restart
	@echo "✓ Services restarted"

docker-ps:
	docker-compose ps

# Quick shortcuts
up: docker-up
down: docker-down
logs: docker-logs
restart: docker-restart
