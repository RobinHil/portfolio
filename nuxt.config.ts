// https://nuxt.com/docs/api/configuration/nuxt-config

/*
 * Site entierement statique.
 *
 * `nuxt generate` prerend les quatre pages publiques, plus les deux routes
 * serveur listees dans nitro.prerender.routes, et ecrit le tout dans dist/.
 * Aucun serveur ne tourne ensuite : ni base, ni session, ni API. Les modules
 * qui n'avaient de sens qu'a l'execution ont donc ete retires avec le
 * back-office - nuxt-auth-utils, nuxt-csurf, nuxt-security et @nuxt/image.
 *
 * Consequence a garder en tete : nuxt-security posait la CSP et les en-tetes
 * de securite. Un hebergeur de fichiers statiques comme GitHub Pages ne pose
 * aucun en-tete personnalise, le site n'en a donc plus. Derriere un reverse
 * proxy, c'est a lui de les remettre.
 */
/*
 * Le site peut vivre a la racine d'un domaine comme sous un sous-chemin
 * (/portfolio/ pour un site de projet GitHub Pages). Trois valeurs decrivent
 * cette adresse, et elles ne sont pas interchangeables :
 *
 *  - BASE_URL, le chemin sous lequel le site est servi. Nuxt en prefixe ses
 *    propres assets et les cibles de <NuxtLink>, mais pas un href ecrit a la
 *    main : les liens de app.head ci-dessous sont donc prefixes ici, et le
 *    reste passe par usePublicPath().
 *  - SITE_URL, l'adresse publique complete, sous-chemin compris. Elle sert aux
 *    URL canoniques, aux cartes Open Graph et a la ligne Sitemap du robots.txt.
 *  - SITE_ORIGIN, le schema et l'hote seuls. C'est ce qu'attend @nuxtjs/sitemap,
 *    qui compose lui-meme chaque <loc> avec le chemin de la route - lequel
 *    contient deja BASE_URL. Lui donner SITE_URL doublait le sous-chemin.
 *
 * Le workflow de deploiement les demande a l'action configure-pages plutot que
 * de les ecrire en dur. Les valeurs de repli decrivent un developpement local.
 */
const BASE_URL = process.env.NUXT_APP_BASE_URL || '/'
const SITE_URL = process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const SITE_ORIGIN = process.env.NUXT_SITE_URL || SITE_URL

// Prefixe un chemin de public/ pour les href de app.head, que Nuxt ne touche pas.
const asset = (path: string) => `${BASE_URL.replace(/\/$/, '')}/${path}`

export default defineNuxtConfig({
  compatibilityDate: '2026-07-09',
  devtools: { enabled: false },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/fonts',
    '@nuxtjs/sitemap',
  ],

  css: ['~/assets/css/main.css'],

  app: {
    baseURL: BASE_URL,
    head: {
      htmlAttrs: { lang: 'fr' },
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: asset('favicon.svg') },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: asset('favicon-32x32.png') },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: asset('favicon-16x16.png') },
        { rel: 'apple-touch-icon', sizes: '180x180', href: asset('apple-touch-icon.png') },
        { rel: 'manifest', href: asset('site.webmanifest') },
      ],
      meta: [
        { name: 'theme-color', content: '#0a0f0a' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      siteUrl: SITE_URL,
    },
  },

  site: {
    url: SITE_ORIGIN,
    name: 'Portfolio - Administrateur Systèmes & Cybersécurité',
  },

  nitro: {
    prerender: {
      /*
       * Routes enumerees, et crawlLinks laisse a false a dessein.
       *
       * Le crawler suit les <a> du HTML rendu, or ceux-ci portent deja le
       * chemin de base : sous /portfolio/, il decouvrait "/portfolio/projets"
       * et le traitait comme une route a part entiere. Les pages etaient alors
       * rendues deux fois, et surtout @nuxtjs/sitemap y voyait une page de
       * plus, publiant un <loc> .../portfolio/portfolio qui ne menait nulle
       * part. Quatre pages et deux fichiers se listent tres bien a la main.
       */
      crawlLinks: false,
      routes: ['/', '/a-propos', '/projets', '/contact', '/robots.txt', '/cv.pdf'],
      // Une page qui casse doit casser le build, pas partir en production avec
      // un trou.
      failOnError: true,
    },
  },
})
