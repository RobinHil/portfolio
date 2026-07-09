export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  return prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } })
})
