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

    console.log('is there an item', item);

    if (item) {
      console.log('there is an item');

      if (item.scope === 'public') {
        console.log('it is a public item');

        const session = await getSession({ req });
        const isSiteAdmin = session?.user.roles.includes('SiteAdmin');

        console.log('isSiteAdmin?', isSiteAdmin);

        console.log('section', section);

        if (isSiteAdmin) {
          console.log('section', section);
          const dbSession = await mongoose.startSession();
          try {
            dbSession.startTransaction();

            await Section.deleteOne({ _id: ObjectId(sectionId) });

            await item.sections.pull(section);
            await item.save({ dbSession });
            await dbSession.commitTransaction();

            item = await Item.findById(section.itemid)
              .populate({ path: 'tags', model: Tag })
              .populate({ path: 'sections', model: Section });
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
