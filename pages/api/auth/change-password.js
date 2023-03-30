import { getSession } from 'next-auth/react';

import bcryptjs from 'bcryptjs';
import Member from '../../../mongoose_models/Member';
import db from '/mongo/db';

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

  await db.connect();
  const member = await Member.findOne({ email: memberEmail });

  if (!member) {
    await db.disconnect();
    res.status(404).json({ message: 'Member not found' });
    return;
  }

  const currentPassword = member.password;

  const isValid = bcryptjs.compareSync(oldPassword, currentPassword);

  if (!isValid) {
    await db.disconnect();

    res.status(403).json({ message: 'Invalid password' });

    return;
  }
  const hashedPassword = await bcryptjs.hash(newPassword, 12);

  const result = await Member.updateOne(
    { email: memberEmail },
    { $set: { password: hashedPassword } }
  );

  await db.disconnect();
  res.status(200).json({ message: 'Password updated!' });
  return;
}
export default handler;
