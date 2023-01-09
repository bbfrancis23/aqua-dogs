import { MongoClient } from 'mongodb';

// todo make this an env variable

export async function connectDB() {
  const client = await MongoClient.connect(
    'mongodb+srv://bbfrancis:cm2342Aqua@cluster0.8emijcz.mongodb.net/aquaDogsDB?retryWrites=true&w=majority'
  );

  return client;
}
