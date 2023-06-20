import axios from 'axios';
import db from '/mongo/db';

import Project from '/mongo/schemas/ProjectSchema';
import Board from '/mongo/schemas/BoardSchema';
import Column from '/mongo/schemas/ColumnSchema';
import Item from '/mongo/schemas/ItemSchema';

import { getSession } from 'next-auth/react';

import mongoose from 'mongoose';

export const createItem = async (req, res) => {
  let status = axios.HttpStatusCode.Created;
  let message = '';
  let item = undefined;

  await db.connect();

  const authSession = await getSession({ req });

  if (authSession) {
    const { projectId } = req.query;

    const project = await Project.findOne({ _id: req.query.projectId });

    if (authSession.user.id === project.leader.toString()) {
      const board = await Board.findOne({ _id: req.query.boardId }).populate({
        path: 'columns',
        model: Column,
      });

      if (board.project.toString() === projectId) {
        let column = board.columns.find((c) => c.id === req.query.columnId);

        if (column) {
          const dbSession = await mongoose.startSession();

          try {
            dbSession.startTransaction();

            const newItem = new Item({ title: '', scope: 'private' });

            await newItem.save({ dbSession });

            await column.items.push(newItem);

            await column.save({ dbSession });
            await dbSession.commitTransaction();

            column = await column.toObject({ getters: true });
            status = axios.HttpStatusCode.Created;

            item = newItem.toObject({ getters: true });
          } catch (e) {
            await dbSession.abortTransaction();
            dbSession.endSession();

            console.log('there was an error', e);
            status = axios.HttpStatusCode.InternalServerError;
            message = e;
          }
        } else {
          status = axios.HttpStatusCode.Forbidden;
          message = 'Data is mismatched this is a hacking attempt';
        }
      } else {
        status = axios.HttpStatusCode.Forbidden;
        message = 'Data is mismatched this is a hacking attempt';
      }
    } else {
      status = axios.HttpStatusCode.Forbidden;
      message = 'You must be the Project Leader or Admin to create a Board';
    }
  } else {
    status = axios.HttpStatusCode.Unauthorized;
    message = 'Authentication Required.';
  }
  await db.disconnect();
  res.status(status).json({
    message,
    item,
  });
};

export default createItem;
