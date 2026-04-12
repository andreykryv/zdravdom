# Build stage for client (React + Vite)
FROM node:20-alpine AS client-builder

WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci && npm cache clean --force

COPY client/ ./
RUN npm run build

# Production stage for server (Express API)
FROM node:20-alpine

WORKDIR /app

# Copy server package files
COPY server/package*.json ./

# ✅ Use npm install (not ci) since lockfile may be missing
RUN npm install --omit=dev && npm cache clean --force

# Copy server source code
COPY server/ ./

# Copy built client files from builder stage
COPY --from=client-builder /app/client/dist ./public

EXPOSE 5000
CMD ["npm", "start"]