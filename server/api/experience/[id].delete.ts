import { getIdParam } from '../../utils/handlers'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const id = getIdParam(event)
  await prisma.experience.delete({ where: { id } })
  return { ok: true }
})
