import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getUploadsDir, IMAGE_EXTENSIONS } from '../../utils/uploads'

// Sert les images uploadées depuis le dossier de stockage (volume en production).
// Noms générés par l'API d'upload (UUID + extension) ou préfixés "seed-" par le seed.
const NAME_RE = /^[a-z0-9-]+\.(jpg|jpeg|png|webp|gif|avif)$/i

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name') ?? ''
  if (!NAME_RE.test(name)) {
    throw createError({ statusCode: 404, statusMessage: 'Fichier introuvable' })
  }

  try {
    const data = await readFile(join(getUploadsDir(), name))
    const ext = name.split('.').pop()!.toLowerCase()
    setHeader(event, 'Content-Type', IMAGE_EXTENSIONS[ext] ?? 'application/octet-stream')

    /*
     * Deux régimes de cache, parce qu'il y a deux sortes de noms.
     *
     * Les images téléversées depuis l'admin portent un UUID : le contenu ne
     * peut pas changer sous un nom donné, `immutable` est donc sans risque.
     *
     * Les images du seed, elles, portent un nom stable (`seed-<projet>.jpg`).
     * Remplacer le fichier ne change pas l'URL : avec `immutable`, un visiteur
     * qui a déjà vu l'ancienne version la garderait un an, sans même
     * revalider, et un rechargement ordinaire n'y changerait rien. On leur
     * associe donc un ETag calculé sur le contenu : le navigateur garde son
     * cache tant que l'image ne bouge pas, et reçoit la nouvelle dès qu'elle
     * change.
     */
    if (name.startsWith('seed-')) {
      const etag = `"${createHash('sha1').update(data).digest('base64url')}"`
      setHeader(event, 'ETag', etag)
      setHeader(event, 'Cache-Control', 'public, max-age=0, must-revalidate')
      if (getHeader(event, 'if-none-match') === etag) {
        setResponseStatus(event, 304)
        return null
      }
    } else {
      setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
    }

    return data
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Fichier introuvable' })
  }
})
