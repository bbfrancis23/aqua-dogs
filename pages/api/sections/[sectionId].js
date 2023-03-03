import { getSession } from 'next-auth/react';
import Section from '/mongoose_models/Section';
import SectionType from '/mongoose_models/SectionType';

import Tag from '/mongoose_models/Tag';

import Item from '/mongoose_models/Item';
import db from '/utils/db';

import mongoose from 'mongoose';

export default async function handler(req, res) {
  const { sectionId } = req.query;

  if (req.method === 'PATCH' || req.method === 'DELETE') {
    let status = 200;
    let message = '';

    await db.connect();

    let section;
    let item;

    const session = await getSession({ req: req });

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
              section.sectionType = sectiontype;
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
              const session = await mongoose.startSession();

              try {
                session.startTransaction();
                await section.remove({ session });
                await item.sections.pull(section);
                await item.save({ session });
                await session.commitTransaction();

                item = await Item.findById(itemId)
                  .populate({ path: 'tags', model: Tag })
                  .populate({ path: 'sections', model: Section });
              } catch (e) {
                await session.abortTransaction();
                session.endSession();

                status = 500;
                message: `Error deleting Section ${sectionId}: ${e}`;
              }
            }
          }
        } else {
          status === 404;
          message = `Section not found: ${sectionId} not found.`;
        }
      }
    } else {
      status = 401;
      message = 'Not Authenticated.';
    }

    await db.disconnect();
    res.status(status).json({
      message: message,
      item: item ? item.toObject({ getters: true }) : undefined,
    });
    return;
  }

  return;
}
