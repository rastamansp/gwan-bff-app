# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies)
RUN npm ci --prefer-offline --no-audit --progress=false

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN apk add --no-cache wget && \
    npm ci --prefer-offline --no-audit --progress=false --omit=dev && \
    npm cache clean --force

# Copy built application
COPY --from=builder /app/dist ./dist

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

EXPOSE 3000

CMD ["npm", "run", "start:prod"] 