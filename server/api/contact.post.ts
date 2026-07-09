import { contactMessageSchema } from '../utils/schemas'

export default defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, contactMessageSchema.parse)
  await prisma.contactMessage.create({ data })
  return { ok: true }
})
