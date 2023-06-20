import db from '/mongo/db';
import { ObjectId } from 'mongodb';
import { getSession } from 'next-auth/react';
import axios from 'axios';
import mongoose from 'mongoose';

import Item from 'mongo/schemas/ItemSchema';
import Section from '/mongo/schemas/SectionSchema';

import SectionType from '/mongo/schemas/SectionTypeSchema';
import Tag from '/mongo/schemas/TagSchema';

import { getItem, flattenItem } from '/mongo/controllers/itemControllers';

export const deleteSection = async (req, res) => {
  const { sectionId } = req.query;

  let section = undefined;
  let item = undefined;
  let status = axios.HttpStatusCode.Ok;
  let message = '';
  await db.connect();

  try {
    section = await Section.findById(sectionId).populate({
      path: 'sectiontype',
      model: SectionType,
    });
  } catch (e) {
    status = axios.HttpStatusCode.InternalServerError;
    message = e;
  }

  if (section) {
    try {
      item = await Item.findById(section.itemid);
    } catch (e) {
      status = axios.HttpStatusCode.InternalServerError;
      message = e;
    }

    if (item) {
      if (item.scope === 'public') {
        const session = await getSession({ req });
        const isSiteAdmin = session?.user.roles.includes('SiteAdmin');

        if (isSiteAdmin) {
          const dbSession = await mongoose.startSession();
          try {
            dbSession.startTransaction();

            await Section.deleteOne({ _id: ObjectId(sectionId) });

            await item.sections.pull(section);
            await item.save({ dbSession });
            await dbSession.commitTransaction();

            item = await Item.findById(section.itemid).populate({
              path: 'sections',
              model: Section,
            });
          } catch (e) {
            await dbSession.abortTransaction();
            dbSession.endSession();
            status = axios.HttpStatusCode.InternalServerError;
            message = e;
            console.log(e);
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
  }

  await db.disconnect();

  res.status(status).json({
    message,
    item: item ? item.toObject({ getters: true }) : undefined,
  });
  return;
};
