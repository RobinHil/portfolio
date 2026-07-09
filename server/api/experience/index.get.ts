export default defineEventHandler(async () => {
  return prisma.experience.findMany({ orderBy: [{ order: 'asc' }, { id: 'asc' }] })
})
