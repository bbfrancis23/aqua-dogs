import axios from 'axios'
import db from '@/mongo/db'

import Project from '@/mongo/schemas/ProjectSchema'

import {getServerSession} from 'next-auth/next'
import {authOptions} from '@/pages/api/auth/[...nextauth]'

import {NextApiRequest, NextApiResponse} from 'next'
import {findMemberProjects} from '@/mongo/controls/member/memberControls'

const projectsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions)
  await db.connect()

  console.log('db connected', db)

  if (req.method !== 'POST') {
    res.status(axios.HttpStatusCode.MethodNotAllowed).json({
      message: 'Invalid Method',
    })
    return
  }

  if (!session) {
    res.status(axios.HttpStatusCode.Unauthorized).json({
      message: 'Invalid Session',
    })
    return
  }

  const {title} = req.body

  if (title) {
    if (!session.user) {
      res.status(axios.HttpStatusCode.Unauthorized).json({
        message: 'Invalid Session',
      })
      return
    }

    const user: any = session.user

    const newProj = new Project({title, leader: user.id})
    try {
      console.log('new proj', newProj)
      console.log('session', session.user)
      console.log('trying to save')
      //await db.connect()
      await newProj.save()

      console.log('saved')

      const projects = await findMemberProjects(user.id)
      res.status(axios.HttpStatusCode.Created).json({
        message: 'Success',
        projects,
      })
      return
    } catch (e: any) {
      res.status(axios.HttpStatusCode.InternalServerError).json({
        message: `Error finding Member:  ${e}`,
      })
      return
    }
  }
}
export default projectsHandler

// QA: Brian Francis 8-9-23
