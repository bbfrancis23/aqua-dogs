import { getSession } from 'next-auth/react';

import mongoose from 'mongoose';

import db from '/utils/db';
import Section from '/mongoose_models/Section';
import Item from '/mongoose_models/Item';

import Tag from '/mongoose_models/Tag';

async function hadnler(req, res) {
  if (req.method === 'POST') {
    const session = await getSession({ req: req });

    if (!session) {
      res.status(401).json({ message: 'Not Authenticated' });
    }

    const { sectiontype, content, itemId, order } = req.body;

    await db.connect();

    const newSection = new Section({
      sectiontype,
      content,
      order,
      itemid: itemId,
    });

    let item;

    try {
      item = await Item.findById(itemId);
    } catch (error) {
      await db.disconnect();
      res.status(500).json({ message: 'Error finding Item' });
      return;
    }

    if (!item) {
      await db.disconnect();
      res.status(404).json({ message: 'Invalid item. item does not exist' });
      return;
    }

    try {
      const session = await mongoose.startSession();
      session.startTransaction();
      await newSection.save({ session });
      await item.sections.push(newSection);
      await item.save({ session });

      await session.commitTransaction();
    } catch (error) {
      await db.disconnect();
      res.status(500).json({ message: `Server Error:  ${error}` });
      return;
    }

    try {
      item = await Item.findById(itemId)
        .populate({ path: 'tags', model: Tag })
        .populate({ path: 'sections', model: Section });
    } catch (error) {
      await db.disconnect();
      res.status(500).json({ message: `Error finding Item: ${error}` });
      return;
    }

    if (!item) {
      await db.disconnect();
      res.status(404).json({ message: 'Invalid item. item does not exist' });
      return;
    }

    await db.disconnect();
    res.status(201).json({
      message: 'Section Created',
      item: item.toObject({ getters: true }),
    });
  }
}
export default hadnler;
