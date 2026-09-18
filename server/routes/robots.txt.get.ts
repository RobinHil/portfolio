export default defineEventHandler((event) => {
  const siteUrl = useRuntimeConfig(event).public.siteUrl.replace(/\/$/, '')
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  // Route prérendue : exécutée une fois pendant `nuxt generate`, écrite dans
  // dist/robots.txt. Les anciennes lignes `Disallow: /admin` et `Disallow: /api`
  // sont parties avec le back-office et les routes qu'elles protégeaient : il
  // n'y a plus rien à interdire, et interdire une adresse inexistante ne fait
  // que la signaler.
  return [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    '',
  ].join('\n')
})
