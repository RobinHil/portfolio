export default defineEventHandler(async () => {
  const profile = await prisma.profile.findUnique({ where: { id: 1 } })
  if (!profile) {
    throw createError({ statusCode: 404, statusMessage: 'Profil non initialisé' })
  }
  return profile
})
