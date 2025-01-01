FROM node:23.3.0-slim as builder

# Install system dependencies
RUN apt-get update && \
    apt-get install -y python3 make g++ && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy workspace files
COPY package.json pnpm-workspace.yaml ./
COPY packages/core ./packages/core

# Copy client files
COPY client/package.json ./client/
COPY client/vite.config.ts client/tsconfig.json client/tsconfig.app.json client/tsconfig.node.json ./client/
COPY client/src ./client/src
COPY client/public ./client/public
COPY client/index.html ./client/
COPY client/postcss.config.js client/tailwind.config.js ./client/

# Install pnpm
RUN npm install -g pnpm@9.4.0

# Install dependencies and build
WORKDIR /app/client

# Create .env file from environment variables
RUN echo "VITE_API_URL=${VITE_API_URL}" > .env && \
    echo "VITE_PRIVY_APP_ID=${VITE_PRIVY_APP_ID}" >> .env

RUN pnpm install
RUN pnpm add -D dotenv
RUN pnpm build

# Production image
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/client/dist /usr/share/nginx/html

# Configure nginx
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]