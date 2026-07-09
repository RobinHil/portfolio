#!/bin/sh
set -e

echo "[entrypoint] Application des migrations Prisma…"
./node_modules/.bin/prisma migrate deploy

echo "[entrypoint] Démarrage du serveur Nuxt…"
exec node .output/server/index.mjs
