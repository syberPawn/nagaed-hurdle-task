# syntax=docker/dockerfile:1

# ---- Stage 1: install production dependencies ----
FROM node:22-alpine AS deps
WORKDIR /app

# Copy only the manifests first, so this layer is cached until dependencies change.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ---- Stage 2: runtime image (no npm cache or build leftovers) ----
FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Run as the unprivileged "node" user that ships with the official image.
# The app files stay owned by root, so the process cannot modify its own code.
USER node

EXPOSE 5000
CMD ["node", "app.js"]
