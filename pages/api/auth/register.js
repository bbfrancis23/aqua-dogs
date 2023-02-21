import { hashPassword } from '/lib/auth';
import { connectDB } from '/lib/db';

async function handler(req, res) {
  // Do not use this for now.
  return;

  if (req.method !== 'POST') {
    return;
  }

  const data = req.body;

  const { email, password } = data;

  if (
    !email ||
    !email.includes('@') ||
    !password ||
    password.trim().length < 6
  ) {
    res.status(422).json({ message: 'Invalid Input' });

    return;
  }

  const client = await connectDB();

  const db = client.db();

  const hashedPassword = await hashPassword(password);

  db.collection('members').insertOne({
    email: email,
    password: hashedPassword,
  });

  client.close();
  res.status(201).json({ message: 'Registered Member' });
}

export default handler;
