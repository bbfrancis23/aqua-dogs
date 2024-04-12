import db from '@/mongo/db'
import {authOptions} from '@/pages/api/auth/[...nextauth]'
import {PatchBoardResponse} from '@/pages/api/projects/[projectId]/boards/[boardId].ts/boardApi'
import {NextApiRequest, NextApiResponse} from 'next'
import {getServerSession} from 'next-auth/next'
import {forbiddenRes, notFoundRes, notFoundResponse, serverErrRes, unauthRes} from '../responses'
import Board from '@/mongo/schemas/BoardSchema'
import Project from '@/mongo/schemas/ProjectSchema'

export const patchBoard = async (req: NextApiRequest, res: NextApiResponse<PatchBoardResponse>) => {
  console.log('patching board')

  const {projectId, boardId} = req.query

  const authSession = await getServerSession(req, res, authOptions)

  await db.connect()

  if (!authSession) {
    unauthRes(res, 'Authenticate to Update a Board')
    return
  }

  const project = await Project.findOne({_id: projectId, leader: authSession.user.id})

  if (!project) {
    unauthRes(res, 'You must be the Project Leader to update the Board')
    return
  }
  let board = await Board.findById(boardId)

  if (!board) {
    notFoundResponse(res, 'Board not found')
    return
  }

  const {title, columns, scope, archive} = req.body

  if (title) {
    board.title = title
  } else if (columns) {
    board.columns = columns
  } else if (scope) {
    board.scope = scope
  } else if (archive) {
    board.archive = archive
  }

  try {
    await board.save()
    board = await board.toObject({getters: true})
  } catch (e) {
    console.error(e)
    await db.disconnect()
    serverErrRes(res, 'Error saving board')
    return
  }

  await db.disconnect()
  res.status(200).json({
    message: 'Board Updated',
    board,
  })
}
