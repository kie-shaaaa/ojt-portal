# -------------- Build Stage ------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Backend URL (build-time)
ARG BACKEND_URL=https://ntc-ojt-portal-backend.onrender.com

ENV NEXT_PUBLIC_API_URL=${BACKEND_URL}
ENV NEXT_PUBLIC_LOCAL_URL=${BACKEND_URL}
ENV LOCAL_URL=${BACKEND_URL}

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code (DO NOT copy next-env.d.ts)
COPY next.config.ts ./
COPY postcss.config.mjs ./
COPY tsconfig.json ./
COPY eslint.config.mjs ./
COPY public ./public
COPY src ./src

# Build app
RUN npm run build


# -------------- Runtime Stage ------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Runtime env (same backend URL)
ENV NEXT_PUBLIC_API_URL=https://ntc-ojt-portal-backend.onrender.com
ENV NEXT_PUBLIC_LOCAL_URL=https://ntc-ojt-portal-backend.onrender.com
ENV LOCAL_URL=https://ntc-ojt-portal-backend.onrender.com

# Install only production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy build output only
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "run", "start", "--", "--hostname", "0.0.0.0"]