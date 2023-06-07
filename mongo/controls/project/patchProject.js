import db from '/mongo/db';
import { getSession } from 'next-auth/react';
import mongoose from 'mongoose';

import Project from '/mongo/schemas/ProjectSchema';

import axios from 'axios';

export const patchProject = async (req, res) => {
  const { projectId } = req.query;

  let status = axios.HttpStatusCode.Ok;
  let message = '';
  let project = undefined;

  const authSession = await getSession({ req });

  await db.connect();

  if (authSession) {
    project = await Project.findById(projectId);

    if (project) {
      if (project.leader._id.toString() === authSession.user.id) {
        if (req.body.title) {
          const { title } = req.body;
          project.title = title;
        }

        try {
          await project.save();

          project = await Project.findOne({ _id: projectId }).populate(
            'leader',
            '-password -authCode'
          );
        } catch (e) {
          status = 500;
          message = `Updating Item failed: ${e}`;
        }
      } else {
        status = axios.HttpStatusCode.Unauthorized;
        message = 'You do not have authorization to change the project';
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
    project,
  });
  return;
};
