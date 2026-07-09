import { skillSchema } from '../../utils/schemas'
import { getIdParam } from '../../utils/handlers'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const id = getIdParam(event)
  const data = await readValidatedBody(event, skillSchema.parse)
  return prisma.skill.update({ where: { id }, data })
})
