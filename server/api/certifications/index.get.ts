export default defineEventHandler(async () => {
  return prisma.certification.findMany({ orderBy: [{ order: 'asc' }, { id: 'asc' }] })
})
