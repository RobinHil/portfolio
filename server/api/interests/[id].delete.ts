import { getIdParam } from '../../utils/handlers'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const id = getIdParam(event)
  await prisma.interest.delete({ where: { id } })
  return { ok: true }
})
