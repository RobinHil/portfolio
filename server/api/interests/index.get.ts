export default defineEventHandler(async () => {
  return prisma.interest.findMany({ orderBy: [{ order: 'asc' }, { id: 'asc' }] })
})
