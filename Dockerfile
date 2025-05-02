FROM node:20-bullseye AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Debug: List source files
RUN echo "=== Source files ===" && \
    ls -la src/modules/auth/infrastructure/strategies/

# Build the application with verbose output
RUN npm run build --verbose

# Debug: List dist files
RUN echo "=== Dist files ===" && \
    ls -la dist/modules/auth/infrastructure/strategies/

# Production stage
FROM node:20-bullseye

WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm install --only=production --legacy-peer-deps

# Copy built application and necessary files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Debug: List final files
RUN echo "=== Final files ===" && \
    ls -la /app/dist/modules/auth/infrastructure/strategies/

# Create non-root user
RUN groupadd -r appgroup && useradd -r -g appgroup appuser && \
    chown -R appuser:appgroup /app
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

EXPOSE 3000

CMD ["npm", "run", "start:prod"] 