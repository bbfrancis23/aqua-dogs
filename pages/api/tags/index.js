import { getSession } from 'next-auth/react';

import db from '../../../utils/db';

import Tag from '../../../mongoose_models/Tag';

async function handler(req, res) {
  if (req.method === 'GET') {
    await db.connect();

    const tags = await Tag.find();
    await db.disconnect();

    if (tags) {
      res.json({ tags: tags.map((u) => u.toObject({ getters: true })) });
      return;
    }

    res.status(404).json({ message: 'No Tags found' });
    return;
  }

  return;
}

export default handler;
