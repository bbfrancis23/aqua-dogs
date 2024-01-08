import db from '@/mongo/db'
import Project from '@/mongo/schemas/ProjectSchema'

export const getProjects = async () => {
  await db.connect()

  const projects = await Project.find()
    .populate('leader', '-password -authCode')
    .populate('admins', '-password -authCode')
    .populate('members', '-password -authCode')

  return projects
}
