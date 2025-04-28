FROM node:20-alpine

WORKDIR /app

# Install dependencies
RUN apk add --no-cache wget

# Copy application files
COPY . .

# Install dependencies and build
RUN npm install --legacy-peer-deps && \
    npm run build && \
    npm prune --production --legacy-peer-deps

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

EXPOSE 3000

CMD ["npm", "run", "start:prod"] 