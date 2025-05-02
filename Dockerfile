FROM node:20-bullseye AS builder

# Create app user first
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

WORKDIR /app

# Set proper permissions
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Copy package files
COPY --chown=appuser:appgroup package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install --legacy-peer-deps

# Copy source code
COPY --chown=appuser:appgroup . .

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

# Create app user
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

WORKDIR /app

# Set proper permissions
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Install production dependencies
COPY --chown=appuser:appgroup package*.json ./
RUN npm install --only=production --legacy-peer-deps

# Copy built application and necessary files
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/package*.json ./

# Debug: List final files
RUN echo "=== Final files ===" && \
    ls -la /app/dist/modules/auth/infrastructure/strategies/

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

EXPOSE 3000

CMD ["npm", "run", "start:prod"] 