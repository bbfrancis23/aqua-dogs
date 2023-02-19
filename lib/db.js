import { MongoClient } from 'mongodb';

export async function connectDB() {
  return await MongoClient.connect(process.env.MONGO_CONNECT);
}
