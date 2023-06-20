import db from '/mongo/db';

import Board from '/mongo/schemas/BoardSchema';
import Project from '/mongo/schemas/ProjectSchema';

import Column from '/mongo/schemas/ColumnSchema';
import Item from '/mongo/schemas/ItemSchema';

import mongoose from 'mongoose';

import { ObjectId } from 'mongodb';

export const findProjectBoards = async (id) => {
  let boards = null;

  await db.connect();

  boards = await Board.find({ project: id }).populate({
    path: 'columns',
    populate: { path: 'items', model: Item },
  });

  boards = boards.map((b) => b.toObject({ getters: true, flattenMaps: true }));

  boards = await JSON.stringify(boards);
  boards = await JSON.parse(boards);
  await db.disconnect();

  return boards;
};
