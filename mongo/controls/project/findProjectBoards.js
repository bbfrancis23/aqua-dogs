import db from '/mongo/db';

import Board from '/mongo/schemas/BoardSchema';
import Project from '/mongo/schemas/ProjectSchema';

import mongoose from 'mongoose';

export const findProjectBoards = async (id) => {
  let boards = null;

  await db.connect();

  boards = await Board.find({ project: id });

  boards = await JSON.stringify(boards);
  boards = await JSON.parse(boards);
  await db.disconnect();

  console.log(boards);

  return boards;
};
