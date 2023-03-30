import bcryptjs from 'bcryptjs';
import Member from '../../../mongoose_models/Member';
import db from '/mongo/db';

async function handler(req, res) {
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

  await db.connect();

  let existingMember;

  let existingUser;
  try {
    existingUser = await Member.findOne({ email });
  } catch (error) {
    await db.disconnect();
    res.status(500).json({ message: `Server Error:  ${error}` });
    return;
  }

  if (existingUser) {
    await db.disconnect();
    res.status(422).json({
      message: 'Could not register new memeber. Member already exists.',
    });
    return;
  }

  const hashedPassword = await bcryptjs.hash(password, 12);

  const newMember = new Member({ email, password: hashedPassword });

  try {
    await newMember.save();
  } catch (error) {
    await db.disconnect();
    res.status(500).json({ message: `Server Error:  ${error}` });
    return;
  }

  await db.disconnect();
  res.status(201).json({ message: 'New Member Registered' });
  return;
}
export default handler;

// import { hashPassword } from '/lib/auth';
// import { connectDB } from '/lib/db';

// async function handler(req, res) {
//   // Do not use this for now.
//   return;

//   if (req.method !== 'POST') {
//     return;
//   }

//   const data = req.body;

//   const { email, password } = data;

//   if (
//     !email ||
//     !email.includes('@') ||
//     !password ||
//     password.trim().length < 6
//   ) {
//     res.status(422).json({ message: 'Invalid Input' });

//     return;
//   }

//   const client = await connectDB();

//   const db = client.db();

//   const hashedPassword = await hashPassword(password);

//   db.collection('members').insertOne({
//     email: email,
//     password: hashedPassword,
//   });

//   client.close();
//   res.status(201).json({ message: 'Registered Member' });
// }

// export default handler;
