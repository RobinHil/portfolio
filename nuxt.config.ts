// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-07-09',
  devtools: { enabled: false },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxt/fonts',
    'nuxt-auth-utils',
    'nuxt-security',
    'nuxt-csurf',
    '@nuxtjs/sitemap',
  ],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
      meta: [
        { name: 'theme-color', content: '#0a0f0a' },
      ],
    },
  },

  runtimeConfig: {
    // Surchargées par NUXT_ADMIN_EMAIL / NUXT_ADMIN_PASSWORD / NUXT_ADMIN_NAME.
    // La connexion se fait au mot de passe seul : adminEmail n'est qu'un
    // libellé de compte, seul adminPassword est un secret.
    adminEmail: 'admin@local',
    adminPassword: '',
    adminName: 'Admin',
    public: {
      // Surchargée par NUXT_PUBLIC_SITE_URL
      siteUrl: 'http://localhost:8080',
    },
  },

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:8080',
    name: 'Portfolio - Administrateur Systèmes & Cybersécurité',
  },

  sitemap: {
    exclude: ['/admin/**'],
  },

  image: {
    domains: ['images.unsplash.com'],
    quality: 80,
  },

  security: {
    headers: {
      contentSecurityPolicy: {
        'img-src': ["'self'", 'data:', 'https://images.unsplash.com'],
        'frame-ancestors': ["'none'"],
      },
      crossOriginEmbedderPolicy: false,
      xFrameOptions: 'DENY',
      xContentTypeOptions: 'nosniff',
      referrerPolicy: 'strict-origin-when-cross-origin',
    },
    // Le rate limiting global est désactivé ; il est activé de façon ciblée
    // sur les routes sensibles via routeRules ci-dessous.
    rateLimiter: false,
  },

  routeRules: {
    '/api/auth/login': {
      security: {
        // 5 tentatives de connexion max par minute et par IP
        rateLimiter: { tokensPerInterval: 5, interval: 60000, throwError: true },
      },
    },
    '/api/contact': {
      security: {
        // 3 messages max par minute et par IP
        rateLimiter: { tokensPerInterval: 3, interval: 60000, throwError: true },
      },
    },
    '/api/uploads': {
      security: {
        // Upload d'images admin : autorise des corps multipart jusqu'à ~40 Mo
        requestSizeLimiter: {
          maxRequestSizeInBytes: 40_000_000,
          maxUploadFileRequestInBytes: 40_000_000,
        },
      },
    },
    '/admin/**': { robots: false },
  },

  csurf: {
    methodsToProtect: ['POST', 'PUT', 'PATCH', 'DELETE'],
  },
})
