FROM node:20-bullseye as builder

# Create app user and set up directories with root
RUN getent group appgroup || groupadd -r appgroup && \
    getent passwd appuser || useradd -r -g appgroup appuser

WORKDIR /app

# Create npm cache and log directories
RUN mkdir -p /app/.npm-cache /app/.npm-logs && \
    chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Set npm to use local directories
ENV NPM_CONFIG_CACHE=/app/.npm-cache
ENV NPM_CONFIG_LOGS=/app/.npm-logs
ENV NPM_CONFIG_PREFIX=/app/.npm-global

# Copy package files
COPY --chown=appuser:appgroup package*.json ./

# Install ALL dependencies (including devDependencies) in builder stage
RUN npm install --legacy-peer-deps

# Copy source code
COPY --chown=appuser:appgroup . .

# Debug: List source files
RUN echo "=== Source files (strategies) ===" && \
    ls -la src/modules/auth/infrastructure/strategies/ && \
    echo "=== Source files (guards) ===" && \
    ls -la src/modules/auth/infrastructure/guards/

# Build with webpack
RUN npm run build

# Verify the build output
RUN echo "=== Checking build output (strategies) ===" && \
    ls -la dist/modules/auth/infrastructure/strategies/ && \
    echo "=== Checking build output (guards) ===" && \
    ls -la dist/modules/auth/infrastructure/guards/ && \
    echo "=== Checking guard file contents ===" && \
    cat dist/modules/auth/infrastructure/guards/jwt-auth.guard.js || echo "Guard file not found!"

# Production stage
FROM node:20-bullseye

# Create app user and set up directories with root
RUN getent group appgroup || groupadd -r appgroup && \
    getent passwd appuser || useradd -r -g appgroup appuser

WORKDIR /app

# Create npm cache and log directories
RUN mkdir -p /app/.npm-cache /app/.npm-logs && \
    chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Set npm to use local directories
ENV NPM_CONFIG_CACHE=/app/.npm-cache
ENV NPM_CONFIG_LOGS=/app/.npm-logs
ENV NPM_CONFIG_PREFIX=/app/.npm-global

# Install only production dependencies in final stage
RUN npm install --only=production --legacy-peer-deps

# Copy dist and node_modules
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules

# Verify the final files
RUN echo "=== Verifying final files (strategies) ===" && \
    ls -la dist/modules/auth/infrastructure/strategies/ && \
    echo "=== Verifying final files (guards) ===" && \
    ls -la dist/modules/auth/infrastructure/guards/ && \
    echo "=== Verifying guard file contents ===" && \
    cat dist/modules/auth/infrastructure/guards/jwt-auth.guard.js || echo "Guard file not found in final image!"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

EXPOSE 3000

CMD ["npm", "run", "start:prod"] 