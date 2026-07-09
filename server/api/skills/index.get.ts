export default defineEventHandler(async () => {
  return prisma.skill.findMany({ orderBy: [{ order: 'asc' }, { id: 'asc' }] })
})
