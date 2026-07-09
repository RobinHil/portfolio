export default defineEventHandler(async () => {
  return prisma.education.findMany({ orderBy: [{ order: 'asc' }, { id: 'asc' }] })
})
