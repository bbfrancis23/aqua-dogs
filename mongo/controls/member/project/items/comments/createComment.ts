import {
  internalServerErrorResponse,
  notFoundResponse,
  unauthorizedResponse,
} from '@/mongo/controls/responses'
import Project from '@/mongo/schemas/ProjectSchema'
import {NextApiRequest, NextApiResponse} from 'next'
import db from '@/mongo/db'

import {getSession} from 'next-auth/react'
import Item from '@/mongo/schemas/ItemSchema'
import Section from '@/mongo/schemas/SectionSchema'
import Member from '@/mongo/schemas/MemberSchema'

import Comment from '@/mongo/schemas/CommentSchema'
import mongoose from 'mongoose'
import axios from 'axios'
import {findItem} from '../findItem'

export const createComment = async (req: NextApiRequest, res: NextApiResponse) => {
  const {commenttype, content} = req.body
  const {projectId, itemId} = req.query

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

  let item = await Item.findById(itemId).populate([
    {path: 'sections', model: Section},
    {path: 'comments', model: Comment, populate: {path: 'owner', model: Member}},
  ])

  if (!item) {
    notFoundResponse(res, 'Item not found')
    return
  }

  const castSession: any = authSession
  const newComment = new Comment({
    sectiontype: commenttype,
    content,
    itemid: itemId,
    owner: castSession.user.id,
  })

  try {
    const dbSession = await mongoose.startSession()
    dbSession.startTransaction()
    await newComment.save({dbSession})
    await item.comments.push(newComment)
    await item.save({dbSession})

    await dbSession.commitTransaction()
  } catch (e) {
    console.log(e)
    internalServerErrorResponse(res, 'Error creating comment')
    return
  }
  item = await findItem(item._id)
  await db.disconnect()

  return res.status(axios.HttpStatusCode.Ok).json({
    message: 'Comment was saved',
    item,
  })
}
