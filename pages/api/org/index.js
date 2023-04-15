import axios from 'axios';
import db from '/mongo/db';

import Organization from '/mongo/schemas/OrganizationSchema';

import { getSession } from 'next-auth/react';

const handler = async (req, res) => {
  let status = axios.HttpStatusCode.BadRequest;
  let message = 'Invalid Method';

  await db.connect();

  if (req.method === 'POST') {
    const session = await getSession({ req });

    if (session) {
      const { title } = req.body;

      if (title) {
        const newOrg = new Organization({ title, leader: session.user.id });

        try {
          await newOrg.save();
          status = axios.HttpStatusCode.Created;
        } catch (e) {
          status = axios.HttpStatusCode.InternalServerError;
          message = `Server Error: ${e}`;
        }
      } else {
        status = axios.HttpStatusCode.NoContent;
        message = 'Invalid Input';
      }
    } else {
      status = axios.HttpStatusCode.Unauthorized;
      message = 'Not Authenticated';
    }
  }

  await db.disconnect();
  res.status(status).json({
    message,
  });
};
export default handler;
