import axios from 'axios'
import db from '@/mongo/db'

import Project from '@/mongo/schemas/ProjectSchema'

import {getSession} from 'next-auth/react'
import {getServerSession} from 'next-auth/next'
//import {findMemberProjects} from '@/mongo/controllers/memberControllers'
import {NextApiRequest, NextApiResponse} from 'next'
import {findMemberProjects} from '@/mongo/controls/member/memberControls'
import {authOptions} from '../../auth/[...nextauth]'

const projectsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(' trying to create project')

  await db.connect()

  if (req.method !== 'POST') {
    res.status(axios.HttpStatusCode.MethodNotAllowed).json({
      message: 'Invalid Method',
    })
    return
  }

  //const session = await getSession({req})
  const session = await getServerSession(req, res, authOptions)

  console.log('session', session)
  // console.log('req', req)

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
      await newProj.save()
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
