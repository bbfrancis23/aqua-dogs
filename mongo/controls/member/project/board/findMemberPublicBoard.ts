import db from '@/mongo/db'

import Board from '@/mongo/schemas/BoardSchema'
import Item from '@/mongo/schemas/ItemSchema'
import Column from '@/mongo/schemas/ColumnSchema'

import Section from '@/mongo/schemas/SectionSchema'

export const findPublicBoard = async (id: string) => {
  let board = undefined

  await db.connect()

  board = await Board.findOne({
    _id: id,
    scope: 'PUBLIC',
    archive: {$ne: true},
  }).populate({
    path: 'columns',
    model: Column,
    match: {archive: {$ne: true}},
    populate: {
      path: 'items',
      model: Item,
      match: {archive: {$ne: true}},
      populate: {path: 'sections', model: Section},
    },
  })

  board = board.toObject({getters: true, flattenMaps: true})

  board = await JSON.stringify(board)
  board = await JSON.parse(board)
  await db.disconnect()

  return board
}

export default findPublicBoard
