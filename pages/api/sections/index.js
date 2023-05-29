// import { getSession } from 'next-auth/react';

// import mongoose from 'mongoose';

// import db from '/mongo/db';
// import Section from '/mongo/schemas/SectionSchema';
// import Item from '/mongo/schemas/ItemSchema';

// import Tag from '/mongo/schemas/TagSchema';
import { createSection } from 'mongo/controllers/sectionControllers/createSection';

/* eslint-disable */

async function hadnler(req, res) {
  if (req.method === 'POST') {
    await createSection(req, res);
    return;
    // const session = await getSession({ req });

    // if (!session) {
    //   res.status(401).json({ message: 'Not Authenticated' });
    // }

    // const { sectiontype, content, itemId, order } = req.body;

    // await db.connect();

    // const newSection = new Section({
    //   sectiontype,
    //   content,
    //   order,
    //   itemid: itemId,
    // });

    // let item;

    // try {
    //   item = await Item.findById(itemId);
    // } catch (error) {
    //   await db.disconnect();
    //   res.status(500).json({ message: 'Error finding Item' });
    //   return;
    // }

    // if (!item) {
    //   await db.disconnect();
    //   res.status(404).json({ message: 'Invalid item. item does not exist' });
    //   return;
    // }

    // try {
    //   const dbSession = await mongoose.startSession();
    //   dbSession.startTransaction();
    //   await newSection.save({ dbSession });
    //   await item.sections.push(newSection);
    //   await item.save({ dbSession });

    //   await dbSession.commitTransaction();
    // } catch (error) {
    //   await db.disconnect();
    //   res.status(500).json({ message: `Server Error:  ${error}` });
    //   return;
    // }

    // try {
    //   item = await Item.findById(itemId)
    //     .populate({ path: 'tags', model: Tag })
    //     .populate({ path: 'sections', model: Section });
    // } catch (error) {
    //   await db.disconnect();
    //   res.status(500).json({ message: `Error finding Item: ${error}` });
    //   return;
    // }

    // if (!item) {
    //   await db.disconnect();
    //   res.status(404).json({ message: 'Invalid item. item does not exist' });
    //   return;
    // }

    // await db.disconnect();
    // res.status(201).json({
    //   message: 'Section Created',
    //   item: item.toObject({ getters: true }),
    // });
  }
}
export default hadnler;
