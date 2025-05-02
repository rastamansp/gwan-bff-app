FROM node:20-bullseye AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    wget \
    curl \
    vim \
    git \
    openssh-server \
    && rm -rf /var/lib/apt/lists/*

# Configure SSH
RUN mkdir /var/run/sshd
RUN echo 'root:root' | chpasswd
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Debug: List source files
RUN ls -la /app/src/modules/auth/infrastructure/strategies/

# Build the application
RUN npm run build

# Debug: List dist files
RUN ls -la /app/dist/modules/auth/infrastructure/strategies/

# Production stage
FROM node:20-bullseye

WORKDIR /app

# Install production dependencies and debug tools
RUN apt-get update && apt-get install -y \
    wget \
    curl \
    vim \
    git \
    openssh-server \
    && rm -rf /var/lib/apt/lists/*

# Configure SSH
RUN mkdir /var/run/sshd
RUN echo 'root:root' | chpasswd
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config

# Install production dependencies
COPY package*.json ./
RUN npm install --only=production --legacy-peer-deps

# Copy built application and necessary files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Debug: List final files
RUN ls -la /app/dist/modules/auth/infrastructure/strategies/

# Debug: Print the contents of the dist directory
RUN find /app/dist -type f -name "*.js" | grep -i jwt

# Start SSH service
EXPOSE 22

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

EXPOSE 3000

# Start both SSH and the application
CMD service ssh start && npm run start:prod 