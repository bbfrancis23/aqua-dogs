import { getSession } from 'next-auth/react';

import mongoose from 'mongoose';

import Item from '/mongoose_models/Item';
import Tag from '/mongoose_models/Tag';
import Section from '/mongoose_models/Section';
import db from '/utils/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    await db.connect();

    const items = await Item.find()
      .populate({ path: 'tags', model: Tag })
      .populate({ path: 'sections', model: Section });

    await db.disconnect();

    if (items) {
      res.json({ items: items.map((i) => i.toObject({ getters: true })) });
      return;
    }

    res.status(404).json({ message: 'No Tags found' });
    return;
  } else if (req.method === 'POST') {
    await db.connect();

    console.log('creating new item');

    const session = await getSession({ req: req });

    if (!session) {
      await db.disconnect();
      res.status(401).json({ message: 'Not Authenticated.' });
      return;
    }

    const item = new Item({ title: '' });

    try {
      await item.save();
    } catch (e) {
      await db.disconnect();
      res.status(500).json({ message: `Error Creating Item ${e}` });
      return;
    }

    res.status(201).json({
      message: 'Item Created',
      item: item.toObject({ getters: true }),
    });
  }
}

///import { connectDB } from '../../../lib/db';

// export default async function handler(req, res) {
//   const client = await connectDB();
//   const db = client.db();

//   if (req.method === 'GET') {
//     let items = await db.collection('items').find().toArray();

//     let tags = await db.collection('tags').find().toArray();

//     tags = tags.map((t) => {
//       return { id: t._id.toString(), title: t.title };
//     });

//     items = items.map((i) => {
//       return {
//         id: i._id.toString(),
//         _id: i._id.toString(),
//         title: i.title,
//         tags: i.tags.map((t) => {
//           const match = tags.find((gt) => gt.id === t.toString());
//           return { id: t.id, title: match?.title };
//         }),
//       };
//     });

//     res.status(201).json({ message: 'success!', data: items });
//   }

//   client.close();
// }
