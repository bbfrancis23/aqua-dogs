import { connectDB } from '../../../lib/db';

export default async function handler(req, res) {
  const client = await connectDB();
  const db = client.db();

  if (req.method === 'GET') {
    let items = await db.collection('items').find().toArray();

    let tags = await db.collection('tags').find().toArray();

    tags = tags.map((t) => {
      return { id: t._id.toString(), title: t.title };
    });

    items = items.map((i) => {
      return {
        id: i._id.toString(),
        _id: i._id.toString(),
        title: i.title,
        tags: i.tags.map((t) => {
          const match = tags.find((gt) => gt.id === t.toString());
          return { id: t.id, title: match?.title };
        }),
      };
    });

    res.status(201).json({ message: 'success!', data: items });
  }

  client.close();
}
