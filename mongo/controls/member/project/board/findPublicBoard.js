import db from '/mongo/db'

import Board from '/mongo/schemas/BoardSchema'

import Column from '/mongo/schemas/ColumnSchema'
import Item from '/mongo/schemas/ItemSchema'

import Section from '/mongo/schemas/SectionSchema'

export const findPublicBoard = async (id) => {
  let board = undefined

  await db.connect()

  board = await Board.findOne({
    _id: id,
  }).populate({
    path: 'columns',
    match: {archive: {$ne: true}},
    populate: {
      path: 'items',
      model: Item,
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
