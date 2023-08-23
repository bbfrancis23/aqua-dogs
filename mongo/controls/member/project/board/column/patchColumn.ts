import db from '@/mongo/db'
import {ColumnResponse} from '@/interfaces/ColumnInterface'
import {
  forbiddenResponse,
  internalServerErrorResponse,
  notFoundResponse,
  unauthorizedResponse,
} from '@/mongo/controls/responses'
import Project from '@/mongo/schemas/ProjectSchema'
import {NextApiRequest, NextApiResponse} from 'next'
import {getSession} from 'next-auth/react'
import Column from '@/mongo/schemas/ColumnSchema'
import axios from 'axios'
import findPublicBoard from '../findPublicBoard'

export const patchColumn = async (req: NextApiRequest, res: NextApiResponse<ColumnResponse>) => {
  const {projectId, boardId, columnId} = req.query

  const authSession = await getSession({req})

  await db.connect()

  if (!authSession) {
    unauthorizedResponse(res, 'You are not logged in')
    return
  }

  const project = await Project.findById(projectId)

  if (!project) {
    notFoundResponse(res, 'Project not found')
    return
  }

  const castSession: any = authSession

  if (project.leader._id.toString() !== castSession.user.id) {
    forbiddenResponse(res, 'You do not have permission to edit this board')
    return
  }

  let column = await Column.findById(columnId)

  if (!column) {
    notFoundResponse(res, 'Column not found')
    return
  }

  if (req.method === 'DELETE') {
    column.archive = true
  } else {
    column.title = req.body.title
  }

  try {
    await column.save()
    column = await Column.findById(columnId)
    column = await column.toObject({getters: true})
  } catch (e) {
    console.error(e)
    internalServerErrorResponse(res, 'Error saving board')
    return
  }

  await db.disconnect()

  const board = await findPublicBoard(boardId)

  return res.status(axios.HttpStatusCode.Ok).json({
    message: 'Column was updated',
    board,
  })
}
