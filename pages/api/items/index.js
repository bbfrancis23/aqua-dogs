import { getSession } from 'next-auth/react';

import db from '/mongo/db';

import Item from '/mongo/schemas/ItemSchema';
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let status = axios.HttpStatusCode.Created;
    let message = 'Created';
    let item = new Item({ title: '' });

    await db.connect();

    const session = await getSession({ req });
    const isSiteAdmin = session?.user.roles.includes('SiteAdmin');

    if (!isSiteAdmin) {
      status = axios.HttpStatusCode.Forbidden;
      message = 'Not Authenticated';
    } else {
      if (req.body.tags) {
        item.tags = req.body.tags;
      }

      try {
        await item.save();
      } catch (e) {
        status = axios.HttpStatusCode.InternalServerError;
        message = `Error Creating Item ${e}`;
      }
    }

    res.status(status).json({
      message,
      item: item.toObject({ getters: true }),
    });
  }
}
