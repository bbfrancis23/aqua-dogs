import axios from 'axios'
import db from '@/mongo/db'
import Project from '@/mongo/schemas/ProjectSchema'
import {getServerSession} from 'next-auth/next'
import {authOptions} from '@/pages/api/auth/[...nextauth]'

import {NextApiRequest, NextApiResponse} from 'next'
import {emptyFieldRes, serverErrRes, unauthRes} from '../responses'
import {findMemberProjects} from '../member/memberControls'

const createProject = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions)

  await db.connect()
  const {title} = req.body

  if (!session) {
    unauthRes(res, 'Authenticate to Create a Project')
    return
  }

  if (!title) {
    emptyFieldRes(res, 'Project Title is Required')
    return
  }

  const {user} = session

  const newProj = new Project({title, leader: user.id})
  try {
    await newProj.save()
    const projects = await findMemberProjects(user.id)
    await db.disconnect()
    res.status(axios.HttpStatusCode.Created).json({
      message: 'Project Created',
      projects,
    })
    return
  } catch (e: any) {
    serverErrRes(res, `Error Creating Project:  ${e}`)
    return
  }
}

export default createProject
