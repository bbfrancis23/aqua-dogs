import db from '/mongo/db';
import { getSession } from 'next-auth/react';
import Tag from '/mongo/schemas/TagSchema';

import axios from 'axios';

import { getTag } from '/mongo/controllers/tagsControllers';

export default async function handler(req, res) {
  const { tagId } = req.query;

  if (req.method === 'PATCH') {
    let status = axios.HttpStatusCode.Ok;
    let message = '';
    let tag = {};

    try {
      tag = await Tag.findById(tagId);
    } catch (e) {
      message = `Error finding Tag: ${e}`;
      status = axios.HttpStatusCode.InternalServerError;
    }

    if (status === axios.HttpStatusCode.Ok) {
      const session = await getSession({ req });

      if (session) {
        const isSiteAdmin = session?.user.roles.includes('SiteAdmin');

        if (isSiteAdmin) {
          const { tagCols } = req.body;
          tag.tagCols = tagCols;

          try {
            await tag.save();
            // tag = await getTag(tagId);
          } catch (e) {
            status = 500;
            message = `Updating Item failed: ${e}`;
          }
        } else {
          status = 401;
          message = 'Not Authenticated.';
        }
      } else {
        status = 401;
        message = 'Not Authenticated.';
      }
    }

    res.status(status).json({ message, tag });
  }
}
