/** Meta tags complets (title/description + Open Graph + Twitter Card + canonical) pour une page. */
export function usePageSeo(opts: { title: string, description: string, path: string }) {
  const siteUrl = useRuntimeConfig().public.siteUrl.replace(/\/$/, '')
  const url = siteUrl + opts.path
  const image = `${siteUrl}/images/og.png`

  useSeoMeta({
    title: opts.title,
    description: opts.description,
    ogTitle: opts.title,
    ogDescription: opts.description,
    ogType: 'website',
    ogUrl: url,
    ogImage: image,
    ogLocale: 'fr_FR',
    ogSiteName: UI.site.title,
    twitterCard: 'summary_large_image',
    twitterTitle: opts.title,
    twitterDescription: opts.description,
    twitterImage: image,
  })

  useHead({
    link: [{ rel: 'canonical', href: url }],
  })
}
