import axios from 'axios';
import db from '/mongo/db';

import Project from '/mongo/schemas/ProjectSchema';

import { getSession } from 'next-auth/react';
import { getMemberProjects } from '/mongo/controllers/memberControllers';

const handler = async (req, res) => {
  let status = axios.HttpStatusCode.BadRequest;
  let message = '';
  let projects = {};

  await db.connect();

  if (req.method === 'POST') {
    const session = await getSession({ req });

    if (session) {
      const { title } = req.body;

      if (title) {
        const newProj = new Project({ title, leader: session.user.id });

        try {
          await newProj.save();
          status = axios.HttpStatusCode.Created;
          projects = await getMemberProjects(session.user.id);
        } catch (e) {
          status = axios.HttpStatusCode.InternalServerError;
          message = e;
        }
      } else {
        status = axios.HttpStatusCode.NoContent;
      }
    } else {
      status = axios.HttpStatusCode.Unauthorized;
    }
  }

  await db.disconnect();
  res.status(status).json({
    message,
    projects,
  });
};
export default handler;
