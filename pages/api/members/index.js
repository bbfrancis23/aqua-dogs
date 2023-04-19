import Member from '/mongo/schemas/MemberSchema';

import { getSession } from 'next-auth/react';
import { getMembers } from '/mongo/controllers/memberControllers';

import axios from 'axios';

export default async function handler(req, res) {
  let status = axios.HttpStatusCode.BadRequest;
  let message = 'Invalid Method';
  let members = null;

  if (req.method === 'GET') {
    const session = await getSession({ req });

    if (session) {
      try {
        members = await getMembers();
      } catch (e) {
        status = axios.HttpStatusCode.InternalServerError;
        message = `Error: ${e}`;
      }

      status = axios.HttpStatusCode.Ok;
      message = 'Success';
    } else {
      status = axios.HttpStatusCode.Unauthorized;
      message = 'Not Authenticated';
    }
  }

  res.status(status).json({
    message,
    members,
  });
}
