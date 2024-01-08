import db from '@/mongo/db'

import Project from '@/mongo/schemas/ProjectSchema'

import {getServerSession} from 'next-auth/next'
import {authOptions} from '@/pages/api/auth/[...nextauth]'

import axios from 'axios'

import {forbiddenRes, notFoundRes, unauthRes} from '@/mongo/controls/responses'
import {NextApiRequest, NextApiResponse} from 'next'
import {PatchProjectResponse} from '@/pages/api/projects/[projectId]/projIdApi'

export const patchProject = async (
  req: NextApiRequest,
  res: NextApiResponse<PatchProjectResponse>
) => {
  const {projectId} = req.query

  const authSession = await getServerSession(req, res, authOptions)

  await db.connect()

  if (!authSession) {
    unauthRes(res, 'Authenticate to Update a Project')
    return
  }

  let project = await Project.findById(projectId)

  if (!project) {
    notFoundRes(res, 'Project not found')
    return
  }

  const castSession: any = authSession
  const memberId = castSession.user.id

  if (project.leader._id.toString() !== memberId) {
    forbiddenRes(res, 'Project Leader Permission Required')
    return
  }

  if (req.body.archive) {
    project.archive = req.body.archive
  } else if (req.body.title) {
    project.title = req.body.title
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

  await project.save()

  project = await Project.findOne({_id: projectId})
    .populate('leader', '-password -authCode')
    .populate('admins', '-password -authCode')
    .populate('members', '-password -authCode')

  project = await project.toObject({
    getters: true,
  })

  await db.disconnect()
  return res.status(axios.HttpStatusCode.Ok).json({
    message: 'Project was updated',
    project,
  })
}
