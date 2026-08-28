import { certificationSchema } from '../../utils/schemas'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const data = await readValidatedBody(event, certificationSchema.parse)
  return prisma.certification.create({ data })
})
