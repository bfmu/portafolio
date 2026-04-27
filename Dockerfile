# syntax=docker/dockerfile:1
# ----- build stage -----
FROM node:lts-alpine AS build
WORKDIR /app

# pnpm via corepack — lockfile is pnpm-lock.yaml, not package-lock.json.
RUN corepack enable

# Cache deps independently of source code.
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# ----- runtime stage -----
# Static site → all we need is `serve` pointing at /app/dist.
FROM node:lts-alpine AS runtime
WORKDIR /app

RUN npm install -g serve@14

COPY --from=build /app/dist ./dist

EXPOSE 4321
CMD ["serve", "-s", "dist", "-l", "4321"]
