import { interestSchema } from '../../utils/schemas'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const data = await readValidatedBody(event, interestSchema.parse)
  return prisma.interest.create({ data })
})
