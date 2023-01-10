import { ObjectId } from 'mongodb';
import { connectDB } from '../../../../lib/db';

export default async function handler(req, res) {
  const client = await connectDB();

  const db = client.db();

  const { tagId } = req.query;

  const items = db
    .collection('items')
    .find({ tags: ObjectId(tagId.toString()) });

  const aItems = await items.toArray();

  res.status(201).json({ message: 'Created user!', data: aItems });
  client.close();
}
