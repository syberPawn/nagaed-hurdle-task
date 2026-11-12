# syntax=docker/dockerfile:1

# ---- Stage 1: build the React app ----
FROM node:22-alpine AS build
WORKDIR /app

# Copy only the manifests first, so this layer is cached until dependencies change.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Stage 2: serve the static files with Nginx ----
# nginx-unprivileged is the official NGINX image that runs as a non-root user (port 8080).
FROM nginxinc/nginx-unprivileged:1.30-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
