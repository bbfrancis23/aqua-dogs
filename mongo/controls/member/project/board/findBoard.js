import db from '/mongo/db';

import Board from '/mongo/schemas/BoardSchema';
import Project from '/mongo/schemas/ProjectSchema';

import Column from '/mongo/schemas/ColumnSchema';

import mongoose from 'mongoose';

export const findBoard = async (id) => {
  await db.connect();

  let board = await Board.find({ id });

  await db.disconnect();
};

export default findBoard;
