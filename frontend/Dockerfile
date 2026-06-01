# -------------- Build Stage ------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Backend URL used by the frontend. Override at build time when deploying.
ARG BACKEND_URL=http://localhost:5000
ENV NEXT_PUBLIC_API_URL=${BACKEND_URL}
ENV NEXT_PUBLIC_LOCAL_URL=${BACKEND_URL}
ENV LOCAL_URL=${BACKEND_URL}

# Install dependencies
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy files needed to build
COPY next-env.d.ts ./
COPY next.config.ts ./
COPY postcss.config.mjs ./
COPY tsconfig.json ./
COPY eslint.config.mjs ./
COPY public ./public
COPY src ./src

# Build Next.js app
RUN npm run build

# -------------- Runtime Stage ------------------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Keep the same backend URL available when the app starts.
ARG BACKEND_URL=http://localhost:5000
ENV NEXT_PUBLIC_API_URL=${BACKEND_URL}
ENV NEXT_PUBLIC_LOCAL_URL=${BACKEND_URL}
ENV LOCAL_URL=${BACKEND_URL}

# Install production dependencies only
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

# Copy built artifacts
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/next-env.d.ts ./next-env.d.ts

# Start the application on all interfaces so Docker can expose it
EXPOSE 3000
CMD ["npm", "run", "start", "--", "--hostname", "0.0.0.0"]