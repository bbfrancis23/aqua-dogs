import { ObjectId } from 'mongodb';
import { connectDB } from '../../../lib/db';

export default async function handler(req, res) {
  const client = await connectDB();

  const db = client.db();

  db.collection('items')
    .find({ tags: ObjectId('63b0d7302beee78c4a512880') })
    .toArray((err, result) => {
      client.close();
      if (err) throw err;
      res.status(201).json({ message: 'found', data: result });
    });
}
