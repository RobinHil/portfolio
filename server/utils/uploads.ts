import { mkdir } from 'node:fs/promises'
import { join, resolve } from 'node:path'

/**
 * Dossier de stockage des images uploadées depuis l'admin.
 * - dev : ./data/uploads (ignoré par git)
 * - Docker : /data/uploads via NUXT_UPLOADS_DIR (volume persistant, partagé avec SQLite)
 * Les fichiers sont servis par la route GET /uploads/:name.
 */
export function getUploadsDir(): string {
  return resolve(process.env.NUXT_UPLOADS_DIR || join(process.cwd(), 'data/uploads'))
}

export async function ensureUploadsDir(): Promise<string> {
  const dir = getUploadsDir()
  await mkdir(dir, { recursive: true })
  return dir
}

export const IMAGE_EXTENSIONS: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  avif: 'image/avif',
}

// Vérification par nombres magiques (le type MIME annoncé par le client ne suffit pas)
export function sniffImageExtension(buf: Buffer): string | null {
  if (buf.length < 12) return null
  if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return 'jpg'
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]))) return 'png'
  if (buf.subarray(0, 4).toString('ascii') === 'RIFF' && buf.subarray(8, 12).toString('ascii') === 'WEBP') return 'webp'
  if (buf.subarray(0, 6).toString('ascii') === 'GIF87a' || buf.subarray(0, 6).toString('ascii') === 'GIF89a') return 'gif'
  if (buf.subarray(4, 12).toString('ascii').startsWith('ftyp')) return 'avif'
  return null
}
