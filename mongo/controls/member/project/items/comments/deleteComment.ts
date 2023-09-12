import {
  internalServerErrorResponse,
  notFoundResponse,
  unauthorizedResponse,
} from '@/mongo/controls/responses'
import {getSession} from 'next-auth/react'
import {NextApiRequest, NextApiResponse} from 'next/types'

import db from '@/mongo/db'
import {ObjectId} from 'mongodb'
import axios from 'axios'

import mongoose from 'mongoose'

import Project from '@/mongo/schemas/ProjectSchema'
import Item from '@/mongo/schemas/ItemSchema'
import Comment from '@/mongo/schemas/CommentSchema'
import SectionType from '@/mongo/schemas/SectionTypeSchema'
import Section from '@/mongo/schemas/SectionSchema'
import Member from '@/mongo/schemas/MemberSchema'

import {PermissionCodes, permission} from '@/ui/PermissionComponent'

export const deleteComment = async (req: NextApiRequest, res: NextApiResponse) => {
  const {projectId, itemId, commentId} = req.query

  const authSession = await getSession({req})
  await db.connect()

  if (!authSession) {
    unauthorizedResponse(res, 'You are not logged in')
    return
  }

  const project = await Project.findById(projectId)

  if (!project) {
    notFoundResponse(res, 'Project not found')
    return
  }

  let comment = undefined

  try {
    comment = await Comment.findById(commentId).populate([
      {
        path: 'sectiontype',
        model: SectionType,
      },
      {path: 'owner', model: Member},
    ])
  } catch (e) {
    console.log(e)
    internalServerErrorResponse(res, 'Error finding comment')
    return
  }

  if (!comment) {
    notFoundResponse(res, 'Comment not found')
    return
  }

  let item = await Item.findById(itemId).populate([
    {path: 'sections', model: Section},
    {path: 'comments', model: Comment, populate: {path: 'owner', model: Member}},
  ])

  if (!item) {
    notFoundResponse(res, 'Item not found')
    return
  }

  comment = await comment.toObject({getters: true, flattenMaps: true})
  let feComment: any = JSON.stringify(comment)
  feComment = await JSON.parse(feComment)

  const castSession: any = authSession

  const hasPermission = permission({
    code: PermissionCodes.COMMENT_OWNER,
    member: {id: castSession.user.id, email: 'grot@grot.com'},
    comment: feComment,
  })

  if (!hasPermission) {
    unauthorizedResponse(res, 'You do not have permission to edit this comment')
    return
  }

  ///////////////////////

  const dbSession = await mongoose.startSession()
  try {
    dbSession.startTransaction()

    await Comment.deleteOne({_id: commentId})

    await item.comments.pull(comment)
    await item.save({dbSession})
    await dbSession.commitTransaction()

    dbSession.endSession()
  } catch (e) {
    await dbSession.abortTransaction()
    dbSession.endSession()
    console.log(e)
    internalServerErrorResponse(res, 'Error deleting section')
  }

  ////////////////////

  await db.disconnect()

  item = await Item.findById(itemId).populate([
    {path: 'sections', model: Section},
    {path: 'comments', model: Comment, populate: {path: 'owner', model: Member}},
  ])

  item = await item.toObject({getters: true, flattenMaps: true})

  item = JSON.stringify(item)
  item = await JSON.parse(item)

  return res.status(axios.HttpStatusCode.Ok).json({
    message: 'Comment was saved',
    item,
  })
}
