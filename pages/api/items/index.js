import { getSession } from 'next-auth/react';

import mongoose from 'mongoose';

import Item from '/mongoose_models/Item';
import Tag from '/mongoose_models/Tag';
import Section from '/mongoose_models/Section';
import db from '/utils/db';
import { getItems } from '../../../lib/controlers/item';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const result = await getItems();
    res.status(result.status).json({
      message: result.message,
      items: result.items,
    });
    return;
  } else if (req.method === 'POST') {
    await db.connect();

    const session = await getSession({ req: req });
    const isAlphaDog = session?.user.roles.includes('AlphaDog');

    if (!isAlphaDog) {
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
