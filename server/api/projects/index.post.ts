import { projectSchema } from '../../utils/schemas'
import { deserializeProject, serializeProject } from '../../utils/handlers'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const data = await readValidatedBody(event, projectSchema.parse)
  const created = await prisma.project.create({ data: serializeProject(data) })
  return deserializeProject(created)
})
