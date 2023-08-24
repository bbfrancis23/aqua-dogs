import db from '/mongo/db'
import {ObjectId} from 'mongodb'
import {getSession} from 'next-auth/react'
import axios from 'axios'

import Item from '/mongo/schemas/ItemSchema'
import Section from '/mongo/schemas/SectionSchema'
import Project from '/mongo/schemas/ProjectSchema'
import Board from '/mongo/schemas/BoardSchema'

export const patchItem = async (req, res) => {
  const {itemId} = req.query
  let status = axios.HttpStatusCode.Ok
  let message = ''
  let item = undefined
  let board = undefined

  await db.connect()

  try {
    item = await Item.findById(itemId).populate({
      path: 'sections',
      model: Section,
    })
  } catch (e) {
    message = e
    status = axios.HttpStatusCode.InternalServerError
  }

  if (item) {
    const session = await getSession({req})
    const isSiteAdmin = session?.user.roles.includes('SiteAdmin')

    const {title, tags} = req.body

    if (title) {
      item.title = title
    }

    if (tags) {
      item.tags = tags
    }

    try {
      await item.save()
      item = await Item.findById(itemId).populate({
        path: 'sections',
        model: Section,
      })

      board = await Board.findOne({
        _id: req.query.boardId,
        project: req.query.projectId,
      }).populate({
        path: 'columns',
        populate: {path: 'items', model: Item},
      })

      board = board.toObject({getters: true, flattenMaps: true})
    } catch (e) {
      console.log(e)
      status = axios.HttpStatusCode.InternalServerError
      message = e
    }
  } else {
    status = axios.HttpStatusCode.NotFound
    message = `Item ${itemId} not found`
  }

  await db.disconnect()
  res.status(status).json({
    message,
    board,
  })
  return
}
