import { getSession } from 'next-auth/react';
import Section from '/mongo/schemas/SectionSchema';
import SectionType from '/mongo/schemas/SectionTypeSchema';

import Tag from '/mongo/schemas/TagSchema';

import Item from '/mongo/schemas/ItemSchema';
import db from '/mongo/db';

import mongoose from 'mongoose';

/* eslint-disable */

export default async function handler(req, res) {
  const { sectionId } = req.query;

  if (req.method === 'PATCH' || req.method === 'DELETE') {
    let status = 200;
    let message = '';

    await db.connect();

    let section;
    let item;

    const session = await getSession({ req });

    if (session) {
      try {
        section = await Section.findById(sectionId).populate({
          path: 'sectiontype',
          model: SectionType,
        });
      } catch (e) {
        message = `Error finding Section: ${e}`;
        status = 500;
      }

      if (status === 200) {
        if (section) {
          if (req.method === 'PATCH') {
            const { sectiontype, content } = req.body;

            if (sectiontype) {
              section.sectiontype = sectiontype;
            }
            if (content) {
              section.content = content;
            }

            try {
              await section.save();
              section = await Section.findById(sectionId).populate({
                path: 'sectiontype',
                model: SectionType,
              });

              item = await Item.findById(section.itemid)
                .populate({ path: 'tags', model: Tag })
                .populate({ path: 'sections', model: Section });
            } catch (e) {
              status = 500;
              message = `Updating Section failed: ${e}`;
            }
          } else if (req.method === 'DELETE') {
            item = await Item.findById(section.itemid)
              .populate({ path: 'tags', model: Tag })
              .populate({ path: 'sections', model: Section });

            const itemId = section.itemid;

            if (!item) {
              status = 404;
              message = `Could not find Item: ${section.itemid}`;
            } else {
              const dbSession = await mongoose.startSession();

              try {
                dbSession.startTransaction();
                await section.remove({ dbSession });
                await item.sections.pull(section);
                await item.save({ dbSession });
                await dbSession.commitTransaction();

                item = await Item.findById(itemId)
                  .populate({ path: 'tags', model: Tag })
                  .populate({ path: 'sections', model: Section });
              } catch (e) {
                await dbSession.abortTransaction();
                dbSession.endSession();

                status = 500`Error deleting Section ${sectionId}: ${e}`;
              }
            }
          }
        } else {
          status = 404;
          message = `Section not found: ${sectionId} not found.`;
        }
      }
    } else {
      status = 401;
      message = 'Not Authenticated.';
    }

    await db.disconnect();
    res.status(status).json({
      message,
      item: item ? item.toObject({ getters: true }) : undefined,
    });
  }
}
