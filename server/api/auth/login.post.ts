import { loginSchema } from '../../utils/schemas'
import { globalLockRemaining, recordFailure, recordSuccess } from '../../utils/loginThrottle'

export default defineEventHandler(async (event) => {
  // Plafond global : complète la limite par IP de nuxt-security, qui repose sur
  // X-Forwarded-For et peut donc être contournée.
  const lockedFor = globalLockRemaining()
  if (lockedFor > 0) {
    setHeader(event, 'Retry-After', String(lockedFor))
    throw createError({ statusCode: 429, statusMessage: 'Trop de tentatives' })
  }

  const { password } = await readValidatedBody(event, loginSchema.parse)

  // Portfolio mono-administrateur : le compte est unique, il n'y a pas
  // d'identifiant à fournir. On prend le plus ancien pour rester déterministe.
  const user = await prisma.user.findFirst({ orderBy: { id: 'asc' } })

  const invalid = createError({ statusCode: 401, statusMessage: 'Mot de passe invalide' })

  if (!user) {
    recordFailure()
    throw invalid
  }

  const valid = await verifyPassword(user.password, password)
  if (!valid) {
    recordFailure()
    throw invalid
  }

  recordSuccess()

  await setUserSession(event, {
    user: { id: user.id, email: user.email, name: user.name },
    loggedInAt: Date.now(),
  })

  return { ok: true }
})
