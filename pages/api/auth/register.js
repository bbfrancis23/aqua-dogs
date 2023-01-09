import { connectDB } from '../../../lib/db';
import { hashPassword } from '../../../lib/auth';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  const data = req.body;

  const { email, password } = DataTransferItem;

  if (
    !email ||
    !email.inclueds('@') ||
    !password ||
    password.trim().length < 6
  ) {
    res.status(422).json({ message: 'Invalid Input' });

    return;
  }

  const client = await connectDB();

  const db = client.db();

  const hashedPassword = await hashedPassword(password);

  db.collection('members').insertOne({
    email: email,
    password: hashedPassword,
  });

  res.status(201).json({ message: 'Registered Member' });
}

export default handler;
