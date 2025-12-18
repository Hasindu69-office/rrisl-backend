# Build stage
FROM node:20-alpine AS build

# Install build dependencies for native modules
RUN apk update && apk add --no-cache \
    build-base \
    gcc \
    autoconf \
    automake \
    zlib-dev \
    libpng-dev \
    vips-dev \
    git \
    python3

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
ENV NODE_ENV=production
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install runtime dependencies for native modules
RUN apk update && apk add --no-cache \
    vips-dev \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
ENV NODE_ENV=production
RUN npm ci --only=production

# Copy built application from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public
COPY --from=build /app/config ./config
COPY --from=build /app/src ./src
COPY --from=build /app/favicon.png ./favicon.png

# Create uploads directory
RUN mkdir -p public/uploads && chown -R node:node /app

# Switch to non-root user
USER node

# Expose the port
EXPOSE 1337

# Start the application
CMD ["npm", "run", "start"]


