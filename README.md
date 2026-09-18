# Portfolio "Terminal"

Portfolio personnel avec une expérience **terminal interactive** (boot animé, navigation par commandes, autocomplétion, historique) doublée d'une navigation classique toujours visible pour les visiteurs non-tech.

Le site est **entièrement statique** : `nuxt generate` prérend les quatre pages, le CV et le `robots.txt`, et la sortie se sert comme des fichiers. Aucun serveur ne tourne en production, il n'y a ni base de données, ni session, ni API.

## Stack

| Domaine | Choix |
|---|---|
| Framework | Nuxt 3, prérendu statique (`nuxt generate`) |
| Styling | Tailwind CSS (`@nuxtjs/tailwindcss`) + `@nuxt/fonts` (JetBrains Mono auto-hébergée) |
| Contenu | module TypeScript versionné ([utils/content.ts](utils/content.ts)) |
| SEO | `@nuxtjs/sitemap`, `useSeoMeta` par page, `robots.txt` prérendu, Open Graph |
| Images | fichiers de `public/`, servis tels quels |
| CV PDF | `pdfkit`, engendré au build - PDF texte, une colonne, ATS-friendly (`/cv.pdf`) |
| Déploiement | GitHub Actions vers GitHub Pages ([.github/workflows/pages.yml](.github/workflows/pages.yml)) |

## Développement local

```bash
pnpm install
pnpm dev                              # http://localhost:3000
```

Commandes utiles :

```bash
pnpm generate                         # site statique dans .output/public
pnpm preview                          # sert le résultat du prérendu
node scripts/generate-assets.mjs      # régénérer favicons et image Open Graph
```

## Variables d'environnement

Aucune n'est nécessaire en développement : les valeurs de repli décrivent un site servi à la racine de `localhost:3000`. Le workflow de déploiement en renseigne trois, qu'il demande à l'action `configure-pages` plutôt que de les écrire en dur. Elles ne sont pas interchangeables, le détail est commenté en tête de [nuxt.config.ts](nuxt.config.ts) :

- `NUXT_APP_BASE_URL` - chemin sous lequel le site est servi, `/portfolio/` pour un site de projet GitHub Pages
- `NUXT_PUBLIC_SITE_URL` - adresse publique complète, sous-chemin compris (canonical, Open Graph, ligne `Sitemap` du robots.txt)
- `NUXT_SITE_URL` - schéma et hôte seuls, ce qu'attend `@nuxtjs/sitemap`, qui compose lui-même chaque `<loc>` avec le chemin de la route

## Personnalisation du contenu

Tout le contenu vit dans [utils/content.ts](utils/content.ts) : profil et liens, expérience, formation, certifications, compétences et langues, centres d'intérêt, projets. Il s'édite en committant. Les sections des pages sont fixes, leur contenu est libre.

L'ordre des tableaux est l'ordre d'affichage : il n'y a pas de champ `order` à maintenir, et les `id` ne servent qu'à donner une clé stable aux boucles de rendu.

- **Photo de profil** : `public/images/profile.jpg`, versionnée. `generate-assets.mjs` ne la régénère pas.
- **Captures de projets** : `public/images/projects/`, voir le [README du dossier](public/images/projects/README.md). Rien ne les recompresse au build.
- **Textes de l'interface** (libellés fixes) : centralisés dans [utils/uiText.ts](utils/uiText.ts) pour préparer un futur bilingue FR/EN.
- **CV PDF** : engendré au build depuis la même source que les pages, par [server/routes/cv.pdf.get.ts](server/routes/cv.pdf.get.ts) - rien à maintenir à la main.

## Ce que le passage au statique a retiré

Le site a eu un back-office, une base SQLite, une authentification et un formulaire de contact. Un hébergeur de fichiers statiques n'exécute rien : il n'y a plus de serveur pour tenir une base, recevoir un POST ou ouvrir une session, et une interface d'édition n'y aurait rien à écrire. Ont donc disparu `server/api/`, `pages/admin/`, Prisma, `nuxt-auth-utils`, `nuxt-csurf` et le déploiement Docker.

Deux conséquences à connaître :

- **Plus d'en-têtes de sécurité.** `nuxt-security` posait la CSP, `X-Frame-Options` et le reste. GitHub Pages ne pose aucun en-tête personnalisé, le site n'en a donc plus. Derrière un reverse proxy, c'est à lui de les remettre.
- **Plus de formulaire de contact.** La page `/contact` garde les liens directs et un `mailto:` prérempli, qui a l'avantage de laisser une trace dans les messages envoyés du visiteur.

## Licence

Le code est sous [licence MIT](LICENSE).

Le **contenu personnel n'est pas couvert** : textes de profil et de CV, photo
(`public/images/profile.jpg`) et captures de projets
(`public/images/projects/`) restent la propriété de leur auteur. Reprenez le
code, pas l'identité.
