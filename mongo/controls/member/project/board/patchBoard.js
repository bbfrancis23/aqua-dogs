import db from '/mongo/db';
import { getSession } from 'next-auth/react';
import mongoose from 'mongoose';

import Project from '/mongo/schemas/ProjectSchema';
import Board from '/mongo/schemas/BoardSchema';

import axios from 'axios';

export const patchBoard = async (req, res) => {
  const { projectId, boardId } = req.query;

  let status = axios.HttpStatusCode.Ok;
  let message = '';
  let board = undefined;

  const authSession = await getSession({ req });

  await db.connect();

  if (authSession) {
    console.log('projectId', projectId);

    const project = await Project.findById(projectId);

    if (project) {
      if (project.leader._id.toString() === authSession.user.id) {
        board = await Board.findById(boardId);

        console.log(board.project, projectId);

        if (board.project.toString() === projectId) {
          if (req.body.title) {
            const { title } = req.body;
            board.title = title;
          }
          try {
            await board.save();
            board = await Board.findById(boardId);
            board = await board.toObject({ getters: true });
          } catch (e) {
            status = 500;
            message = `Updating Item failed: ${e}`;
          }
        } else {
          status = axios.HttpStatusCode.Unauthorized;
          message =
            'You do not have authorization to change the project and board do not match';
        }
      } else {
        status = axios.HttpStatusCode.Unauthorized;
        message =
          'You do not have authorization to change the project not leader';
      }
    } else {
      status = axios.HttpStatusCode.NotFound;
      message = 'Project no found';
    }
  } else {
    status = axios.HttpStatusCode.Unauthorized;
    message = 'You must be logged in.';
  }

  await db.disconnect();

  res.status(status).json({
    message,
    board,
  });
  return;
};
