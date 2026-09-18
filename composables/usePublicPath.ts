/**
 * Résout un chemin de `public/` contre la base du déploiement.
 *
 * Nuxt préfixe de lui-même ses propres assets et les cibles de `<NuxtLink>`,
 * mais pas le `src` d'une `<img>` ni le `href` d'une `<a>` écrits à la main.
 * Or le site vit sous un sous-chemin dès qu'il est publié comme site de projet
 * GitHub Pages (/portfolio/), et un chemin absolu y désigne alors la racine du
 * domaine : "/cv.pdf" au lieu de "/portfolio/cv.pdf".
 *
 * Les URL absolues et les data: URI sont rendues telles quelles.
 */
export function usePublicPath() {
  const baseURL = useRuntimeConfig().app.baseURL

  return (path: string) => {
    if (/^([a-z]+:)?\/\//i.test(path) || path.startsWith('data:')) return path
    return `${baseURL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
  }
}
