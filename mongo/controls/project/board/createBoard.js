import axios from 'axios';
import db from '/mongo/db';

import Project from '/mongo/schemas/ProjectSchema';
import Board from '/mongo/schemas/BoardSchema';

import { getSession } from 'next-auth/react';

export const createBoard = async (req, res) => {
  let status = axios.HttpStatusCode.Ok;
  let message = '';
  let boards = undefined;

  await db.connect();

  if (req.body.title) {
    const { title } = req.body;

    const authSession = await getSession({ req });

    if (authSession) {
      const { projectId } = req.query;

      const project = await Project.findOne({ _id: projectId });

      if (authSession.user.id === project.leader.toString()) {
        const newBoard = new Board({ title, project: projectId });
        await newBoard.save();

        boards = await Board.find({ project: projectId });

        console.log('boards');

        status = axios.HttpStatusCode.Created;
      } else {
        status = axios.HttpStatusCode.Forbidden;
        message = 'You must be the Project Leader or Admin to create a Board';
      }
    } else {
      status = axios.HttpStatusCode.Unauthorized;
      message = 'Authentication Required.';
    }
  } else {
    status = axios.HttpStatusCode.NoContent;
    message = 'Board Title is undefined';
  }

  await db.disconnect();
  res.status(status).json({
    message,
    boards,
  });
  // must be valid project
  // must be project leader or admin
};
