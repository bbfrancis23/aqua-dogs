import axios from 'axios'
import db from '@/mongo/db'

import Project from '@/mongo/schemas/ProjectSchema'
import Board from '@/mongo/schemas/BoardSchema'

import {getServerSession} from 'next-auth/next'
import {authOptions} from '@/pages/api/auth/[...nextauth]'

import {NextApiRequest, NextApiResponse} from 'next'
import {findProjectBoards} from '../projectControls'

export const createBoard = async (req: NextApiRequest, res: NextApiResponse) => {
  let status = axios.HttpStatusCode.Ok
  let message = ''
  let boards = undefined
  const authSession: any = await getServerSession(req, res, authOptions)
  await db.connect()

  if (req.body.title) {
    const {title} = req.body

    if (authSession && authSession.user) {
      const {projectId} = req.query

      const project = await Project.findOne({_id: projectId})

      if (authSession.user.id === project.leader.toString()) {
        const newBoard = new Board({title, project: projectId})
        await newBoard.save()

        boards = await findProjectBoards(project.id)
        // boards = await Board.find({project: projectId})
        // boards = boards.map((b) => ({
        //   id: b._id.toString(),
        //   title: b.title,
        //   project: b.project.toString(),
        //   columns: b.columns,
        // }))

        status = axios.HttpStatusCode.Created
      } else {
        status = axios.HttpStatusCode.Forbidden
        message = 'You must be the Project Leader or Admin to create a Board'
      }
    } else {
      status = axios.HttpStatusCode.Unauthorized
      message = 'Authentication Required.'
    }
  } else {
    status = axios.HttpStatusCode.NoContent
    message = 'Board Title is undefined'
  }

  await db.disconnect()
  res.status(status).json({
    message,
    boards,
  })
}
