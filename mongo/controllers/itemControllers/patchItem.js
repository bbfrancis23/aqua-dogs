import db from '/mongo/db';
import { ObjectId } from 'mongodb';
import { getSession } from 'next-auth/react';
import axios from 'axios';

import Item from '/mongo/schemas/ItemSchema';
import Tag from '/mongo/schemas/TagSchema';
import Section from '/mongo/schemas/SectionSchema';

export const patchItem = async (req, res) => {
  const { itemId } = req.query;
  let status = axios.HttpStatusCode.Ok;
  let message = '';
  let item = undefined;

  await db.connect();

  try {
    item = await Item.findById(itemId).populate({
      path: 'sections',
      model: Section,
    });
  } catch (e) {
    message = e;
    status = axios.HttpStatusCode.InternalServerError;
  }

  if (item) {
    if (item.scope === 'public') {
      const session = await getSession({ req });
      const isSiteAdmin = session?.user.roles.includes('SiteAdmin');

      if (isSiteAdmin) {
        const { title, tags } = req.body;

        if (title) {
          item.title = title;
        }

        if (tags) {
          item.tags = tags;
        }

        try {
          await item.save();
          item = await Item.findById(itemId).populate({
            path: 'sections',
            model: Section,
          });
        } catch (e) {
          status = axios.HttpStatusCode.InternalServerError;
          message = e;
        }
      } else {
        status = axios.HttpStatusCode.Forbidden;
      }
    } else {
      // TODO
    }
  } else {
    status = axios.HttpStatusCode.NotFound;
    message = `Item ${itemId} not found`;
  }

  await db.disconnect();
  res.status(status).json({
    message,
    item: item ? item.toObject({ getters: true }) : undefined,
  });
  return;
};
