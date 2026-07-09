import { deserializeProject } from '../../utils/handlers'

export default defineEventHandler(async () => {
  const projects = await prisma.project.findMany({ orderBy: [{ order: 'asc' }, { id: 'asc' }] })
  return projects.map(deserializeProject)
})
