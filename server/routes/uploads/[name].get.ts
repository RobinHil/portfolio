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
    // Noms uniques (UUID) → cache long sans risque d'obsolescence
    setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
    return data
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Fichier introuvable' })
  }
})
