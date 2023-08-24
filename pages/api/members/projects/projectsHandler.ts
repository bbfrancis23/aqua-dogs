import axios from 'axios'
import db from '@/mongo/db'

import Project from '@/mongo/schemas/ProjectSchema'

import {getSession} from 'next-auth/react'
//import {findMemberProjects} from '@/mongo/controllers/memberControllers'
import {NextApiRequest, NextApiResponse} from 'next'
import {findMemberProjects} from '@/mongo/controls/member/memberControls'

const projectsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  let status = axios.HttpStatusCode.BadRequest
  let message = ''
  let projects = {}

  console.log('projectsHandler')

  await db.connect()

  if (req.method === 'POST') {
    const session: any = await getSession({req})

    if (session) {
      const {title} = req.body

      if (title) {
        const newProj = new Project({title, leader: session.user.id})

        try {
          await newProj.save()
          status = axios.HttpStatusCode.Created
          projects = await findMemberProjects(session.user.id)

          console.log(session.user)
        } catch (e: any) {
          status = axios.HttpStatusCode.InternalServerError
          message = e

          console.log(e)
        }
      } else {
        status = axios.HttpStatusCode.NoContent
      }
    } else {
      status = axios.HttpStatusCode.Unauthorized
    }
  }

  await db.disconnect()
  res.status(status).json({
    message,
    projects,
  })
}
export default projectsHandler

// QA: Brian Francis 8-9-23
