import { z } from 'zod'
import { getIdParam } from '../../utils/handlers'

const patchSchema = z.object({ read: z.boolean() })

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const id = getIdParam(event)
  const { read } = await readValidatedBody(event, patchSchema.parse)
  return prisma.contactMessage.update({ where: { id }, data: { read } })
})
