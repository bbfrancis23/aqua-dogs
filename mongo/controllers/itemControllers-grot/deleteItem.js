import db from '/mongo/db';
import { ObjectId } from 'mongodb';
import { getSession } from 'next-auth/react';

import Section from '/mongo/schemas/SectionSchema';
import axios from 'axios';

import Item from '/mongo/schemas/ItemSchema';

import mongoose from 'mongoose';

export const deleteItem = async (req, res) => {
  const { itemId } = req.query;
  let status = axios.HttpStatusCode.Ok;
  let message = '';
  let item = undefined;

  await db.connect();

  try {
    item = await Item.findById(itemId);
  } catch (e) {
    message = e;
    status = axios.HttpStatusCode.InternalServerError;
  }

  if (item) {
    if (item.scope === 'public') {
      const session = await getSession({ req });
      const isSiteAdmin = session?.user.roles.includes('SiteAdmin');

      if (isSiteAdmin) {
        const dbSession = await mongoose.startSession();

        try {
          dbSession.startTransaction();

          await item.sections.forEach((s) => {
            Section.deleteOne({ _id: s._id.toString() });
          });

          await Item.deleteOne({ _id: ObjectId(itemId.toString()) });
          dbSession.endSession();
        } catch (e) {
          await dbSession.abortTransaction();
          dbSession.endSession();

          console.log('there was an error deleing', e);

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
