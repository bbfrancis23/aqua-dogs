import { getSession } from 'next-auth/react';

import db from '../../../utils/db';

import Tag from '../../../mongoose_models/Tag';
import { getTags } from '../../../lib/controlers/tags';

async function handler(req, res) {
  if (req.method === 'GET') {
    const result = await getTags();
    res.status(result.status).json({
      message: result.message,
      tags: result.tags,
    });
    return;
    // await db.connect();

    // const tags = await Tag.find();
    // await db.disconnect();

    // if (tags) {
    //   res.json({ tags: tags.map((u) => u.toObject({ getters: true })) });
    //   return;
    // }

    // res.status(404).json({ message: 'No Tags found' });
    // return;
  }

  return;
}

export default handler;
