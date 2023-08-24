import db from '/mongo/db';
import { ObjectId } from 'mongodb';
import { getSession } from 'next-auth/react';
import axios from 'axios';
import Item from 'mongo/schemas/ItemSchema';

export const createItem = async (req, res) => {
  if (req.body.scope === 'public') {
    const session = await getSession({ req });
    const isSiteAdmin = session?.user.roles.includes('SiteAdmin');

    let item = new Item({ title: '', scope: 'public' });
    let status = axios.HttpStatusCode.Ok;
    let message = '';
    await db.connect();

    if (isSiteAdmin) {
      try {
        await item.save();
      } catch (e) {
        status = axios.HttpStatusCode.InternalServerError;
        message = e;
      }
    } else {
      status = axios.HttpStatusCode.Forbidden;
    }

    await db.disconnect();

    res.status(status).json({
      message,
      item: item.toObject({ getters: true }),
    });
    return;
  } else if (scope === 'private') {
    // TODO
  }
};
