import { profileSchema } from '../utils/schemas'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const data = await readValidatedBody(event, profileSchema.parse)
  return prisma.profile.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  })
})
