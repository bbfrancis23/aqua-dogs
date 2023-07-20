import db from '/mongo/db';

import Board from '/mongo/schemas/BoardSchema';
// import Project from '/mongo/schemas/ProjectSchema';

import Column from '/mongo/schemas/ColumnSchema';
import Item from '/mongo/schemas/ItemSchema';

import Section from '/mongo/schemas/SectionSchema';

// import mongoose from 'mongoose';

// import { ObjectId } from 'mongodb';

export const findPublicBoard = async (id) => {
  let board = undefined;

  await db.connect();

  board = await Board.findOne({
    _id: id,
  }).populate({
    path: 'columns',
    populate: {
      path: 'items',
      model: Item,
      populate: { path: 'sections', model: Section },
    },
  });

  board = await JSON.stringify(board);
  board = await JSON.parse(board);
  await db.disconnect();

  return board;
};

export default findPublicBoard;
