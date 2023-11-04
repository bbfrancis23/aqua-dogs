import db from '/mongo/db'
import {getSession} from 'next-auth/react'
import mongoose from 'mongoose'

import Project from '/mongo/schemas/ProjectSchema'
import Board from '/mongo/schemas/BoardSchema'

import Column from '/mongo/schemas/ColumnSchema'

import axios from 'axios'

export const patchBoardCols = async (req, res) => {
  const {projectId, boardId} = req.query
  let status = axios.HttpStatusCode.Ok
  let message = ''
  let board = undefined

  const authSession = await getSession({req})

  await db.connect()

  console.log('connected to DB')

  if (authSession) {
    const project = await Project.findById(projectId)

    if (project) {
      if (project.leader._id.toString() === authSession.user.id) {
        board = await Board.findById(boardId)

        const dbSession = await mongoose.startSession()

        if (board.project.toString() === projectId) {
          const boardCols = req.body.boardCols

          try {
            dbSession.startTransaction()

            Object.keys(boardCols).forEach((key) => {
              Column.findById(key).then((r) => {
                const ids = boardCols[key].items.map((i) => i.id)
                r.items = ids
                r.save({dbSession})
              })
            })
          } catch (e) {
            await dbSession.abortTransaction()
            dbSession.endSession()
            status = axios.HttpStatusCode.InternalServerError
            message = e
          }
        } else {
          status = axios.HttpStatusCode.Unauthorized
          message = 'You do not have authorization to change the project and board do not match'
        }
      } else {
        status = axios.HttpStatusCode.Unauthorized
        message = 'You do not have authorization to change the project not leader'
      }
    } else {
      status = axios.HttpStatusCode.NotFound
      message = 'Project no found'
    }
  } else {
    status = axios.HttpStatusCode.Unauthorized
    message = 'You must be logged in.'
  }

  await db.disconnect()

  console.log(message, 'message')

  res.status(status).json({
    message,
    board,
  })
  return
}

export default patchBoardCols
