import { certificationSchema } from '../../utils/schemas'
import { getIdParam } from '../../utils/handlers'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const id = getIdParam(event)
  const data = await readValidatedBody(event, certificationSchema.parse)
  return prisma.certification.update({ where: { id }, data })
})
