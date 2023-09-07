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

import Comment from '@/mongo/schemas/CommentSchema'
import mongoose from 'mongoose'
import axios from 'axios'

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
    console.log('project not found', projectId)
    notFoundResponse(res, 'Project not found')
    return
  }

  const item = await Item.findById(itemId).populate({
    path: 'sections',
    model: Section,
  })

  if (!item) {
    console.log('item not found')
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

  await db.disconnect()

  return res.status(axios.HttpStatusCode.Ok).json({
    message: 'Comment was saved',
    item,
  })
}
