import { loginSchema } from '../../utils/schemas'

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, loginSchema.parse)

  const user = await prisma.user.findUnique({ where: { email } })

  // Message identique que l'email existe ou non (pas d'énumération de comptes)
  const invalid = createError({ statusCode: 401, statusMessage: 'Identifiants invalides' })
  if (!user) throw invalid

  const valid = await verifyPassword(user.password, password)
  if (!valid) throw invalid

  await setUserSession(event, {
    user: { id: user.id, email: user.email, name: user.name },
    loggedInAt: Date.now(),
  })

  return { ok: true }
})
