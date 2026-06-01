# -------------- Build Stage ------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Install Dependencies (dev included for build)
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy files needed to build
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src

# Build NESTJS app to ./dist
RUN npm run build

# -------------- Runtime Stage ------------------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install production dependencies only
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

# Copy built artifacts
COPY --from=builder /app/dist ./dist

# Declare a port
ENV PORT = 8080
EXPOSE 8080

# Start the application
CMD [ "npm", "run", "start:prod"]