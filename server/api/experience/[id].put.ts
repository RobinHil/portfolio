import { experienceSchema } from '../../utils/schemas'
import { getIdParam } from '../../utils/handlers'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const id = getIdParam(event)
  const data = await readValidatedBody(event, experienceSchema.parse)
  return prisma.experience.update({ where: { id }, data })
})
