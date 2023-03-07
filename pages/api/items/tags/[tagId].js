import Item from '/mongoose_models/Item';

import Section from '/mongoose_models/Section';
import Tag from '/mongoose_models/Tag';
import db from '/utils/db';

import { ObjectId } from 'mongodb';
import { groupItemsByTag } from '../../../../lib/controlers/item';

export default async function handler(req, res) {
  const { tagId } = req.query;

  if (req.method === 'GET') {
    console.log('trying to get');
    const result = await groupItemsByTag(tagId);

    res.status(result.status).json({
      message: result.message,
      items: result.items,
    });
    return;
    // let status = 200;
    // let message = '';
    // await db.connect();
    // let items;
    // try {
    //   items = await Item.find({ tags: new ObjectId(tagId.toString()) })
    //     .populate({ path: 'tags', model: Tag })
    //     .populate({ path: 'sections', model: Section });
    // } catch (e) {
    //   message = `Error finding Item: ${e}`;
    //   status = 500;
    // }
    // if (items) {
    //   res.json({ items: items.map((i) => i.toObject({ getters: true })) });
    //   return;
    // } else {
    //   res.status(404).json({ items: [], message: 'No Items found' });
    //   return;
    // }
    // return;
  }
}
