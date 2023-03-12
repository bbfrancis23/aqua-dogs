import { getSession } from 'next-auth/react';
import Member from '../../../mongoose_models/Member';
import db from '/utils/db';

async function handler(req, res) {
  if (req.mentod === 'GET') {
    const session = await getSession({ req: req });

    if (!session) {
      res.status(401).json({ message: 'Not Authenticated' });
    }

    let member;

    try {
      await db.connect();
      const memberEmail = session?.user?.email;
      const member = await Member.findOne({ email: memberEmail });
    } catch (e) {
      res.status(500).json({ message: `Server Error: ${e}` });
    }

    await db.disconnect();

    if (!member) {
      res.status(404).json({ message: 'Member not found' });
      return;
    }

    res.status(200).json({ message: 'Member found', member: member });
    return;
  } else {
    return;
  }
}
