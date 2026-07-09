import { skillSchema } from '../../utils/schemas'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const data = await readValidatedBody(event, skillSchema.parse)
  return prisma.skill.create({ data })
})
