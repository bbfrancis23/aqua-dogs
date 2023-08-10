import db from '@/mongo/db'
import Project from '@/mongo/schemas/ProjectSchema'
import Board from '@/mongo/schemas/BoardSchema'
import Item from '@/mongo/schemas/ItemSchema'

import Columns from '@/mongo/schemas/ColumnSchema'

export const findProject = async (projectId: string) => {
  await db.connect()

  let project = await Project.findOne({_id: projectId})
    .populate('leader', '-password -authCode')
    .populate('admins', '-password -authCode')
    .populate('members', '-password -authCode')

  await db.disconnect()

  if (!project) {
    return false
  }

  project = await project.toObject({getters: true, flattenMaps: true})
  project = JSON.stringify(project)
  project = await JSON.parse(project)

  return project
}

export const findProjectBoards = async (projectId: string) => {
  let boards = undefined
  await db.connect()

  boards = await Board.find({project: projectId}).populate({
    path: 'columns',
    model: Columns,
    populate: {path: 'items', model: Item},
  })

  await db.disconnect()

  boards = boards.map((b) => b.toObject({getters: true, flattenMaps: true}))

  boards = JSON.stringify(boards)
  boards = await JSON.parse(boards)

  return boards
}

// QA: Brian Francis 8-10-23
