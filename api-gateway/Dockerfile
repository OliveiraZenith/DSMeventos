# API Gateway Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Development image
FROM base AS development
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev"]

# Production image
FROM base AS production
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 4000

ENV NODE_ENV=production

CMD ["npm", "start"]
