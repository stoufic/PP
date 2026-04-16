# Multi-stage Docker build for TruckBase

# Backend stage
FROM node:18-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ ./

# Frontend stage
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app

# Install production dependencies
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/src ./src
COPY --from=backend-builder /app/backend/prisma ./prisma
COPY --from=backend-builder /app/backend/package.json ./

# Copy built frontend
COPY --from=frontend-builder /app/frontend/build ./public

# Generate Prisma client
RUN npx prisma generate

# Create logs directory
RUN mkdir -p logs

EXPOSE 3001

ENV NODE_ENV=production

CMD ["npm", "start"]
