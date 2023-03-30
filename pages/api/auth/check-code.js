import db from '/mongo/db';

import Member from '../../../mongoose_models/Member';

import bcryptjs from 'bcryptjs';

async function handler(req, res) {
  if (req.method === 'POST') {
    await db.connect();

    if (req.body.email && req.body.code && req.body.newPassword) {
      const member = await Member.findOne({ email: req.body.email });

      if (!member) {
        await db.disconnect();
        res.status(404).json({ message: 'Member not found' });
        return;
      }

      if (member.authCode !== req.body.code) {
        await db.disconnect();
        res.status(404).json({ message: 'Invalid Code' });
        return;
      }

      const date1 = new Date(member.authTime);
      const date2 = new Date();

      const diffTime = Math.abs(date2 - date1);

      const diff = diffTime / 1000 / 60;

      if (diff > 10) {
        await db.disconnect();
        res.status(400).json({ message: 'Code is no longer valid' });
        return;
      }

      const hashedPassword = await bcryptjs.hash(req.body.newPassword, 12);

      const result = await Member.updateOne(
        { email: req.body.email },
        { $set: { password: hashedPassword } }
      );

      await db.disconnect();
      res.status(200).json({ message: 'Password updated!' });
      return;
    } else {
      await db.disconnect();
      res.status(422).json({ message: 'Invalid Input' });
      return;
    }
  }
}

export default handler;
