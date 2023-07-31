import db from '@/mongo/db'
import {getSession} from 'next-auth/react'
import mongoose from 'mongoose'

import Project from '@/mongo/schemas/ProjectSchema'

import axios from 'axios'
import {forbiddenResponse, notFoundResponse, unauthorizedResponse} from '../../responses'
import {NextApiRequest, NextApiResponse} from 'next'
import {PatchProjectResponse} from 'pages/api/projects/[projectId]/projectsIdHandler'

export const patchProject = async (
  req: NextApiRequest,
  res: NextApiResponse<PatchProjectResponse>
) => {
  const {projectId} = req.query

  const authSession = await getSession({req})

  await db.connect()

  if (!authSession) {
    unauthorizedResponse(res, 'You are not logged in')
    return
  }

  let project = await Project.findById(projectId)

  if (!project) {
    notFoundResponse(res, 'Project not found')
    return
  }

  // TODO: Bug authSession.user.id is not typed for user.id???
  const grot: any = authSession
  const memberId = grot.user.id

  if (project.leader._id.toString() !== memberId) {
    forbiddenResponse(res, 'You do not have permission to edit this project')
    return
  }

  if (req.method === 'DELETE') {
    project.archive = true
  } else if (req.body.title) {
    const {title} = req.body
    project.title = title
  } else if (req.body.addMember) {
    project.members.push(req.body.addMember)
  } else if (req.body.removeMember) {
    project.members.pull({_id: req.body.removeMember})
  } else if (req.body.makeAdmin) {
    project.members.pull({_id: req.body.makeAdmin})
    project.admins.push(req.body.makeAdmin)
  } else if (req.body.removeAdmin) {
    project.admins.pull({_id: req.body.removeAdmin})
    project.members.push(req.body.removeAdmin)
  }

  console.log(project)

  await project.save()

  project = await Project.findOne({_id: projectId})
    .populate('leader', '-password -authCode')
    .populate('admins', '-password -authCode')
    .populate('members', '-password -authCode')

  project = await project.toObject({
    getters: true,
  })

  return res.status(axios.HttpStatusCode.Ok).json({
    message: 'Data was found',
    project,
  })
}
