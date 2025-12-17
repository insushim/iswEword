# Backend Dockerfile for Railway deployment
FROM node:20-alpine

# Install build dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source files
COPY . .

# Build TypeScript
RUN npm run build

# Create data directory
RUN mkdir -p /app/data

# Expose port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Start the server
CMD ["node", "dist/index.js"]
