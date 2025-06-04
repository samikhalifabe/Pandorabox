# Use Node.js 20 as the base image
FROM node:20.18.0-slim as base

# Install system dependencies
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    build-essential \
    node-gyp \
    pkg-config \
    python-is-python3

# Set working directory
WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY package-lock.json ./

# Install root dependencies
RUN npm ci

# Copy frontend files
COPY frontend/ ./frontend/

# Install frontend dependencies and Next.js globally
WORKDIR /app/frontend
RUN npm ci && \
    npm install -g next

# Build frontend
RUN npm run build

# Copy backend files
WORKDIR /app
COPY backend/ ./backend/

# Install backend dependencies
WORKDIR /app/backend
RUN npm ci

# Build backend
RUN npm run build

# Set working directory back to root
WORKDIR /app

# Start the application
CMD ["npm", "start"] 