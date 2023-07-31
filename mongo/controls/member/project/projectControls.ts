import db from '@/mongo/db'
import Project from '@/mongo/schemas/ProjectSchema'

export const findProject = async (projectId: string) => {
  await db.connect()
  let project = await Project.findOne({projectId})

  if (!project) {
    return false
  }

  await db.disconnect()
  project = await project.toObject({getters: true, flattenMaps: true})
  project = JSON.stringify(project)
  project = await JSON.parse(project)

  return project
}
