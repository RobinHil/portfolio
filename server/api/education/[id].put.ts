import { educationSchema } from '../../utils/schemas'
import { getIdParam } from '../../utils/handlers'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const id = getIdParam(event)
  const data = await readValidatedBody(event, educationSchema.parse)
  return prisma.education.update({ where: { id }, data })
})
