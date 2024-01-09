import db from '@/mongo/db'
import {authOptions} from '@/pages/api/auth/[...nextauth]'
import {NextApiRequest, NextApiResponse} from 'next'
import {getServerSession} from 'next-auth/next'
import {emptyFieldRes, serverErrRes, unauthRes} from '../responses'
import Board from '@/mongo/schemas/BoardSchema'
import axios from 'axios'
import Project from '@/mongo/schemas/ProjectSchema'
import {findProjectBoards} from '../project/projectControls'

const createBoard = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions)
  await db.connect()
  const {title} = req.body
  if (!session) {
    unauthRes(res, 'Authenticate to Create a Board')
    return
  }

  if (!title) {
    emptyFieldRes(res, 'Board Title is Required')
    return
  }

  const {projectId} = req.query

  const project = await Project.findOne({_id: projectId, leader: session.user.id})

  if (!project) {
    unauthRes(res, 'You must be the Project Leader to Create a Board')
    return
  }

  try {
    const newBoard = new Board({title, project: projectId})
    await newBoard.save()
    const boards = await findProjectBoards(project.id)
    await db.disconnect()
    res.status(axios.HttpStatusCode.Created).json({
      message: 'Board Created',
      boards,
    })
    return
  } catch (e) {
    serverErrRes(res, `Error Creating Board:  ${e}`)
    return
  }
}

export default createBoard
