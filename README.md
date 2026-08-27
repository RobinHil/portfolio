# Portfolio « Terminal »

Portfolio personnel avec une expérience **terminal interactive** (boot animé, navigation par commandes, autocomplétion, historique) doublée d'une navigation classique toujours visible pour les visiteurs non-tech.

## Stack

| Domaine | Choix |
|---|---|
| Framework | Nuxt 3 (SSR) |
| Styling | Tailwind CSS (`@nuxtjs/tailwindcss`) + `@nuxt/fonts` (JetBrains Mono auto-hébergée) |
| Base de données | SQLite + Prisma 7 (driver adapter `better-sqlite3`, client généré dans `generated/prisma`) |
| Auth admin | `nuxt-auth-utils` (sessions en cookies scellés, mot de passe hashé) |
| Sécurité | `nuxt-security` (headers CSP & co, rate limiting ciblé) + `nuxt-csurf` (CSRF) |
| SEO | `@nuxtjs/sitemap`, `useSeoMeta` par page, robots.txt dynamique, Open Graph |
| Images | `@nuxt/image` (WebP/AVIF, lazy loading, domaine Unsplash autorisé) |
| CV PDF | `pdfkit` côté serveur - PDF texte, une colonne, ATS-friendly (`/api/cv`) |
| Déploiement | Docker multi-stage + nginx en reverse proxy |

## Démarrage rapide (Docker - recommandé)

```bash
cp .env.example .env          # puis renseigner NUXT_SESSION_PASSWORD (openssl rand -base64 32)
docker compose up -d --build
```

- Site : **http://localhost:8080**
- Admin : **http://localhost:8080/admin** - connexion par **mot de passe seul** (`NUXT_ADMIN_PASSWORD` du `.env`), il n'y a pas d'identifiant à saisir

Le compte admin et le contenu placeholder sont créés automatiquement au premier démarrage si la base est vide. Le fichier SQLite est persisté dans le volume Docker `sqlite-data`.

```bash
docker compose logs -f app    # logs applicatifs
docker compose down           # arrêt (les données restent dans le volume)
docker compose up -d          # relance
docker compose down -v        # arrêt + suppression des données (repart de zéro)
```

## Développement local

```bash
pnpm install
cp .env.example .env                  # renseigner NUXT_SESSION_PASSWORD
pnpm exec prisma migrate dev          # crée prisma/dev.db + client
pnpm dev                              # http://localhost:3000
```

Commandes utiles :

```bash
pnpm exec prisma studio               # explorer la base
pnpm exec prisma migrate dev --name x # nouvelle migration après édition du schéma
node scripts/generate-assets.mjs      # régénérer favicons / image OG / avatar placeholder
pnpm build && node .output/server/index.mjs   # test du build de production
```

## Variables d'environnement

Voir [.env.example](.env.example) :

- `DATABASE_URL` - chemin SQLite (`file:...`)
- `NUXT_SESSION_PASSWORD` - clé de chiffrement des sessions (≥ 32 caractères, **obligatoire**)
- `NUXT_ADMIN_PASSWORD` - mot de passe admin initial, **obligatoire** au premier démarrage (créé uniquement si aucun utilisateur en base). C'est le seul secret de connexion : le formulaire n'a qu'un champ.
- `NUXT_ADMIN_EMAIL` / `NUXT_ADMIN_NAME` - purement décoratifs (affichés dans l'interface d'admin), ce ne sont pas des identifiants de connexion
- `NUXT_PUBLIC_SITE_URL` - URL publique (sitemap, canonical, Open Graph)

## Personnalisation du contenu

Tout le contenu s'édite depuis **/admin** (profil & liens, projets, formation, expérience, compétences/langues, centres d'intérêt, messages reçus). Les sections des pages sont fixes, leur contenu est libre.

- **Photo de profil** : remplacer `public/images/profile.jpg` (image placeholder générée).
- **Textes de l'interface** (libellés fixes) : centralisés dans [utils/uiText.ts](utils/uiText.ts) pour préparer un futur bilingue FR/EN.
- **CV PDF** : généré à la volée depuis les données admin - rien à maintenir à la main.

## Sécurité (points vérifiables)

- Rate limiting : 5 tentatives/min par IP sur `/api/auth/login`, 3/min sur `/api/contact` (429 au-delà) - `routeRules` dans [nuxt.config.ts](nuxt.config.ts) ; s'y ajoute un plafond global de 60 échecs par fenêtre de 15 min, indépendant de l'IP ([server/utils/loginThrottle.ts](server/utils/loginThrottle.ts))
- CSRF : toutes les mutations (POST/PUT/PATCH/DELETE) exigent un token `nuxt-csurf` (403 sinon)
- Headers : CSP avec nonces, `X-Frame-Options: DENY`, `X-Content-Type-Options`, `Referrer-Policy`, HSTS
- Sessions : cookies scellés/chiffrés (`nuxt-auth-utils`), mot de passe hashé en base (scrypt)
- Validation : schémas zod sur toutes les entrées API, whitelist de champs (pas de mass assignment)
