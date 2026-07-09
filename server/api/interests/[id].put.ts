import { interestSchema } from '../../utils/schemas'
import { getIdParam } from '../../utils/handlers'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const id = getIdParam(event)
  const data = await readValidatedBody(event, interestSchema.parse)
  return prisma.interest.update({ where: { id }, data })
})
