FROM node:23.3.0-slim as builder

# Install pnpm
RUN npm install -g pnpm@9.4.0

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY src ./src
COPY public ./public
COPY index.html ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY postcss.config.js ./
COPY tailwind.config.js ./

# Install dependencies and build
RUN pnpm install
RUN pnpm build

# Production image
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config if you have custom configuration
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]