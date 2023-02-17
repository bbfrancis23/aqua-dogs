import { ObjectId } from 'mongodb';
import { connectDB } from '../../../lib/db';

export default async function handler(req, res) {
  const client = await connectDB();
  const db = client.db();

  const { itemId } = req.query;

  if (req.method === 'DELETE') {
    const session = client.startSession();

    session.startTransaction();

    try {
      const itemsCollection = await db.collection('items');
      const sectionsCollection = await db.collection('sections');

      const itemDoc = await itemsCollection.findOne({
        _id: ObjectId(itemId.toString()),
      });

      await itemDoc.sections.forEach((s) => {
        sectionsCollection.deleteOne({ _id: ObjectId(s.toString()) });
      });

      await itemsCollection.deleteOne({ _id: ObjectId(itemId.toString()) });
      session.endSession();

      client.close();

      res.status(200).json({ message: 'success' });
    } catch (e) {
      await session.abortTransaction();
      console.log(e);
      session.endSession();
      client.close();
      throw e; // Rethrow so calling function sees
    }
  }
}
