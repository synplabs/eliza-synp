FROM node:23.3.0-slim as builder

# Install pnpm and system dependencies
RUN npm install -g pnpm@9.4.0 && \
    apt-get update && \
    apt-get install -y python3 make g++ git build-essential libtool autoconf automake && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy all files instead of individual copies
COPY . .

# Install dependencies and build
RUN pnpm install
RUN pnpm build

# Production image
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Configure nginx to listen on port 3000
RUN sed -i 's/listen\s*80;/listen 3000;/g' /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]