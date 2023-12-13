import db from '@/mongo/db'
import {getServerSession} from 'next-auth/next'
import {NextApiRequest, NextApiResponse} from 'next'
import {authOptions} from '@/pages/api/auth/[...nextauth]'
import axios from 'axios'
import {PermissionCodes, permission} from '@/fx/ui'
import Board from '@/mongo/schemas/BoardSchema'
import Item from '@/mongo/schemas/ItemSchema'
import Section from '@/mongo/schemas/SectionSchema'
import Project from '@/mongo/schemas/ProjectSchema'
import Member from '@/mongo/schemas/MemberSchema'
import {forbiddenResponse, notFoundResponse, unauthorizedResponse} from '@/mongo/controls/responses'

export const getBoard = async (req: NextApiRequest, res: NextApiResponse) => {
  const {projectId, boardId} = req.query

  const authSession = await getServerSession(req, res, authOptions)
  await db.connect()

  if (!authSession) return unauthorizedResponse(res, 'You are not logged in')

  const project = await Project.findOne({_id: req.query.projectId})
    .populate({path: 'leader', model: Member})
    .populate({path: 'admins', model: Member})
    .populate({path: 'members', model: Member})

  let frontEndProjectFormat = await project.toObject({
    getters: true,
    flattenMaps: true,
  })

  frontEndProjectFormat = JSON.stringify(frontEndProjectFormat)
  frontEndProjectFormat = await JSON.parse(frontEndProjectFormat)

  if (!project) return notFoundResponse(res, 'Project not found')

  let hasPermission = permission({
    code: PermissionCodes.PROJECT_MEMBER,
    member: {id: authSession.user.id, email: 'grot@grot.com'},
    project: frontEndProjectFormat,
  })

  if (!hasPermission) return forbiddenResponse(res, 'You are not a member of this project')

  let board = await Board.findOne({
    _id: boardId,
    project: projectId,
  }).populate({
    path: 'columns',
    match: {archive: {$ne: true}},
    populate: {
      path: 'items',
      model: Item,
      match: {archive: {$ne: true}},
      populate: {path: 'sections', model: Section},
    },
  })
  if (!board) return notFoundResponse(res, 'Board not found')

  board = board.toObject({getters: true, flattenMaps: true})
  await db.disconnect()

  return res.status(axios.HttpStatusCode.Ok).json({
    message: 'Board found',
    board,
  })
}
