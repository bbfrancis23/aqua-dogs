import { getSession } from 'next-auth/react';

import { verifyPassword } from '/lib/auth';

import { connectDB } from '/lib/db';
import { hashPassword } from '/lib/auth';

async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return;
  }

  const session = await getSession({ req: req });

  if (!session) {
    res.status(401).json({ message: 'Not Authenticated' });
  }

  const memberEmail = session?.user?.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  const client = await connectDB();

  const memberCollection = client.db().collection('members');

  const member = await memberCollection.findOne({
    email: memberEmail,
  });

  if (!member) {
    client.close();
    res.status(404).json({ message: 'Member not found' });
    return;
  }

  const currentPassword = member.password;

  const isValid = await verifyPassword(oldPassword, currentPassword);

  if (!isValid) {
    client.close();

    res.status(403).json({ message: 'Invalid password' });

    return;
  }

  const hashedPassword = await hashPassword(newPassword);

  const result = await memberCollection.updateOne(
    { email: memberEmail },
    { $set: { password: hashedPassword } }
  );

  client.close();
  res.status(200).json({ message: 'Password updated!' });
}
export default handler;
