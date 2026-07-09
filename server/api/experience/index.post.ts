import { experienceSchema } from '../../utils/schemas'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const data = await readValidatedBody(event, experienceSchema.parse)
  return prisma.experience.create({ data })
})
