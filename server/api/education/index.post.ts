import { educationSchema } from '../../utils/schemas'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const data = await readValidatedBody(event, educationSchema.parse)
  return prisma.education.create({ data })
})
