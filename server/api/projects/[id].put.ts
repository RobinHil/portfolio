import { projectSchema } from '../../utils/schemas'
import { deserializeProject, getIdParam, serializeProject } from '../../utils/handlers'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const id = getIdParam(event)
  const data = await readValidatedBody(event, projectSchema.parse)
  const updated = await prisma.project.update({ where: { id }, data: serializeProject(data) })
  return deserializeProject(updated)
})
