import { randomUUID } from 'node:crypto'
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ensureUploadsDir, sniffImageExtension } from '../utils/uploads'

const MAX_FILE_SIZE = 8 * 1024 * 1024 // 8 Mo par image
const MAX_FILES = 10

/**
 * Upload d'images depuis l'admin (multipart/form-data, champ "files", multiple).
 * Retourne les chemins publics générés : { urls: ['/uploads/<uuid>.<ext>', …] }
 */
export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const parts = await readMultipartFormData(event)
  const files = (parts ?? []).filter(p => p.filename && p.data?.length)

  if (files.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Aucun fichier reçu' })
  }
  if (files.length > MAX_FILES) {
    throw createError({ statusCode: 400, statusMessage: `Maximum ${MAX_FILES} fichiers par envoi` })
  }

  const dir = await ensureUploadsDir()
  const urls: string[] = []

  for (const file of files) {
    if (file.data.length > MAX_FILE_SIZE) {
      throw createError({ statusCode: 413, statusMessage: `Fichier trop volumineux (max 8 Mo) : ${file.filename}` })
    }
    const ext = sniffImageExtension(file.data)
    if (!ext) {
      throw createError({ statusCode: 415, statusMessage: `Format non supporté (jpg, png, webp, gif, avif) : ${file.filename}` })
    }
    const name = `${randomUUID()}.${ext}`
    await writeFile(join(dir, name), file.data)
    urls.push(`/uploads/${name}`)
  }

  return { urls }
})
