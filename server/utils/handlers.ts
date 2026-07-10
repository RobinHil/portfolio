import type { H3Event } from 'h3'

// Extrait et valide le paramètre d'URL :id
export function getIdParam(event: H3Event): number {
  const raw = getRouterParam(event, 'id')
  const id = Number.parseInt(raw ?? '', 10)
  if (!Number.isInteger(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Identifiant invalide' })
  }
  return id
}

function parseJsonStringArray(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed.filter(t => typeof t === 'string')
  } catch {
    // colonne corrompue → tableau vide
  }
  return []
}

// Les tags et la galerie des projets sont stockés en JSON (colonnes texte SQLite)
export function serializeProject<T extends { tags: string[], gallery: string[] }>(data: T) {
  return { ...data, tags: JSON.stringify(data.tags), gallery: JSON.stringify(data.gallery) }
}

export function deserializeProject<T extends { tags: string, gallery: string }>(project: T) {
  return {
    ...project,
    tags: parseJsonStringArray(project.tags),
    gallery: parseJsonStringArray(project.gallery),
  }
}
