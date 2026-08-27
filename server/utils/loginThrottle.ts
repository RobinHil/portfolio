/**
 * Compteur global de tentatives de connexion.
 *
 * nuxt-security limite déjà /api/auth/login à 5 essais par minute et par IP,
 * mais cette limite s'appuie sur X-Forwarded-For, que l'appelant peut falsifier.
 * Avec une authentification à facteur unique (mot de passe seul), on ajoute donc
 * un plafond global qui tient quelle que soit l'IP annoncée.
 */

const WINDOW_MS = 15 * 60 * 1000
const MAX_FAILURES = 60

let failures = 0
let windowStart = Date.now()

function rollWindow(now: number) {
  if (now - windowStart >= WINDOW_MS) {
    failures = 0
    windowStart = now
  }
}

/** Renvoie le nombre de secondes à attendre si le plafond est atteint, sinon 0. */
export function globalLockRemaining(): number {
  const now = Date.now()
  rollWindow(now)
  if (failures < MAX_FAILURES) return 0
  return Math.ceil((windowStart + WINDOW_MS - now) / 1000)
}

export function recordFailure() {
  rollWindow(Date.now())
  failures += 1
}

/** Connexion réussie : on repart de zéro pour ne pas pénaliser l'admin. */
export function recordSuccess() {
  failures = 0
  windowStart = Date.now()
}
