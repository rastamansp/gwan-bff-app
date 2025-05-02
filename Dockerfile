FROM node:20-bullseye AS builder

# Create app user and set up directories with root
RUN getent group appgroup || groupadd -r appgroup && \
    getent passwd appuser || useradd -m -r -g appgroup appuser

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
RUN echo "=== Source files (strategies) ===" && \
    ls -la src/modules/auth/infrastructure/strategies/ && \
    echo "=== Source files (guards) ===" && \
    ls -la src/modules/auth/infrastructure/guards/

# Build the application with verbose output
RUN npm run build --verbose

# Verify the build output
RUN echo "=== Checking build output (strategies) ===" && \
    ls -la dist/modules/auth/infrastructure/strategies/ && \
    echo "=== Checking build output (guards) ===" && \
    ls -la dist/modules/auth/infrastructure/guards/

# Production stage
FROM node:20-bullseye

# Create app user and set up directories with root
RUN getent group appgroup || groupadd -r appgroup && \
    getent passwd appuser || useradd -m -r -g appgroup appuser

WORKDIR /app

# Set proper permissions
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Copy built application and necessary files
COPY --chown=appuser:appgroup package*.json ./
RUN npm install --only=production --legacy-peer-deps

# Copy dist and node_modules
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules

# Verify the final files
RUN echo "=== Verifying final files (strategies) ===" && \
    ls -la dist/modules/auth/infrastructure/strategies/ && \
    echo "=== Verifying final files (guards) ===" && \
    ls -la dist/modules/auth/infrastructure/guards/

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

EXPOSE 3000

CMD ["npm", "run", "start:prod"] 