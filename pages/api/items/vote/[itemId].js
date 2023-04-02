import db from '/mongo/db';
import Item from '/mongo/schemas/ItemSchema';
import Tag from '/mongo/schemas/TagSchema';
import Section from '/mongo/schemas/SectionSchema';

import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const { itemId } = req.query;
  let status = 405;
  let message = 'Invalid Method';
  let item = undefined;

  if (req.method === 'PATCH') {
    const session = await getSession({ req: req });

    if (session) {
      let item;
      try {
        await db.connect();

        item = await Item.findById(itemId)
          .populate({ path: 'tags', model: Tag })
          .populate({ path: 'sections', model: Section });
      } catch (e) {
        status = 500;
        message = `Server Error: ${e}`;
      }

      if (item) {
        const { vote } = req.body;

        // console.log(item);

        if (vote) {
          if (vote === 'up' || vote === 'down' || vote === 'reset') {
            // remove previous votes

            item.upvotes = item.upvotes.filter((v) => v !== session.user.id);
            item.downvotes = item.downvotes.filter(
              (v) => v !== session.user.id
            );

            if (vote === 'up') {
              item.upvotes.push(session.user.id);
            } else if (vote === 'down') {
              item.downvotes.push(session.user.id);
            }

            await item.save();

            status = 200;
            message = 'Vote Registered';
          } else {
            status = 400;
            message = 'Invalid Vote, please vote "up" or "down"';
          }
        } else {
          status = 400;
          message = 'No vote field';
        }
      } else {
        status = 404;
        message = 'Invalid Item';
      }
    } else {
      status = 403;
      message = 'Permission Denied';
    }
  }

  await db.disconnect();
  res.status(status).json({
    message: message,
    item: item,
  });
  return;
}
