# Build stage for frontend
FROM node:20-alpine AS frontend-builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8 --activate

# Set working directory
WORKDIR /app

# Copy frontend package files
COPY flabby-chubby-fe/package.json flabby-chubby-fe/pnpm-lock.yaml ./

# Install frontend dependencies
RUN pnpm install --frozen-lockfile

# Copy frontend source code
COPY flabby-chubby-fe/ .

# Build the frontend application
RUN pnpm build

# Build stage for backend
FROM node:20-alpine AS backend-builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8 --activate

# Set working directory
WORKDIR /app

# Copy backend package files
COPY flabby-chubby-be/package.json flabby-chubby-be/pnpm-lock.yaml ./

# Install backend dependencies
RUN pnpm install --frozen-lockfile

# Copy backend source code and config files
COPY flabby-chubby-be/ .

# Build backend TypeScript
RUN pnpm run build

# Production stage
FROM node:20-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8 --activate

# Set working directory
WORKDIR /app

# Copy backend package files
COPY flabby-chubby-be/package.json flabby-chubby-be/pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy backend build output from backend-builder
COPY --from=backend-builder /app/dist ./dist

# Copy frontend build output from frontend-builder
COPY --from=frontend-builder /app/dist ./public

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "dist/index.js"]