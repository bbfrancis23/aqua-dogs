import db from '/mongo/db';
import { ObjectId } from 'mongodb';
import { getSession } from 'next-auth/react';
import axios from 'axios';
import mongoose from 'mongoose';

import Item from 'mongo/schemas/ItemSchema';
import Section from '/mongo/schemas/SectionSchema';
import Tag from '/mongo/schemas/TagSchema';

import { getItem, flattenItem } from '/mongo/controllers/itemControllers';

export const createSection = async (req, res) => {
  const { sectiontype, content, itemId, order } = req.body;
  let item = undefined;
  let status = axios.HttpStatusCode.Ok;
  let message = '';

  await db.connect();

  try {
    item = await Item.findById(itemId);
  } catch (e) {
    status = axios.HttpStatusCode.InternalServerError;
    message = e;
  }

  if (item) {
    if (item.scope === 'public') {
      const session = await getSession({ req });
      const isSiteAdmin = session?.user.roles.includes('SiteAdmin');

      if (isSiteAdmin) {
        const newSection = new Section({
          sectiontype,
          content,
          order,
          itemid: itemId,
        });

        try {
          const dbSession = await mongoose.startSession();
          dbSession.startTransaction();
          await newSection.save({ dbSession });
          await item.sections.push(newSection);
          await item.save({ dbSession });

          await dbSession.commitTransaction();
        } catch (e) {
          status = axios.HttpStatusCode.InternalServerError;
          message = e;
        }

        if (item) {
          try {
            item = await Item.findById(itemId)
              .populate({ path: 'tags', model: Tag })
              .populate({ path: 'sections', model: Section });
          } catch (e) {
            status = axios.HttpStatusCode.InternalServerError;
            message = e;
          }
          item = await item.toObject({ getters: true, flattenMaps: true });
          item = await flattenItem(item);
        }
      } else {
        status = axios.HttpStatusCode.Forbidden;
      }
    } else {
      // TODO
    }
  } else {
    status = axios.HttpStatusCode.NotFound;
  }

  await db.disconnect();

  res.status(status).json({
    message,
    item,
  });
  return;
};
