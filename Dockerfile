# syntax=docker/dockerfile:1

# ----- Étape 1 : build de l'application -----
FROM node:22-bookworm-slim AS build
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable
WORKDIR /app

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm exec prisma generate
RUN pnpm build

# ----- Étape 2 : image de production légère -----
FROM node:22-bookworm-slim AS runtime
ENV NODE_ENV=production
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable
WORKDIR /app

# Serveur Nuxt/Nitro autonome
COPY --from=build /app/.output ./.output

# Prisma CLI (+ schéma et migrations) pour appliquer les migrations au démarrage.
# Installation minimale dédiée : le serveur Nitro est autonome, seul le CLI manque.
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./
RUN npm install --no-package-lock prisma@^7 dotenv@^17 \
  && npm cache clean --force

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["docker-entrypoint.sh"]
