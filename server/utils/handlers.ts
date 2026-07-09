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

// Les tags des projets sont stockés en JSON (colonne texte SQLite)
export function serializeProject<T extends { tags: string[] }>(data: T) {
  return { ...data, tags: JSON.stringify(data.tags) }
}

export function deserializeProject<T extends { tags: string }>(project: T) {
  let tags: string[] = []
  try {
    const parsed = JSON.parse(project.tags)
    if (Array.isArray(parsed)) tags = parsed.filter(t => typeof t === 'string')
  } catch {
    // colonne corrompue → tableau vide
  }
  return { ...project, tags }
}
