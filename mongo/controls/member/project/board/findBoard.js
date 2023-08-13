import db from '/mongo/db'

import Board from '/mongo/schemas/BoardSchema'
import Project from '/mongo/schemas/ProjectSchema'

import Column from '/mongo/schemas/ColumnSchema'

import Item from '/mongo/schemas/ItemSchema'

import mongoose from 'mongoose'

import axios from 'axios'

import {getSession} from 'next-auth/react'

export const getBoard = async (req, res) => {
  const {projectId, boardId} = req.query

  let status = axios.HttpStatusCode.Ok
  let message = ''
  let board = undefined

  await db.connect()

  const authSession = await getSession({req})

  if (authSession) {
    const project = await Project.findById(projectId)

    if (project) {
      if (project.leader._id.toString() === authSession.user.id) {
        board = await Board.findOne({
          _id: boardId,
          project: projectId,
        }).populate({
          path: 'columns',
          populate: {path: 'items', model: Item},
        })

        board = board.toObject({getters: true, flattenMaps: true})
      } else {
        status = axios.HttpStatusCode.Unauthorized
        message = 'You do not have authorization to access this board'
      }
    } else {
      status = axios.HttpStatusCode.NotFound
      message = 'Project no found'
    }
  } else {
    status = axios.HttpStatusCode.Unauthorized
    message = 'Authentication Required.'
  }

  await db.disconnect()

  res.status(status).json({
    message,
    board,
  })
}
