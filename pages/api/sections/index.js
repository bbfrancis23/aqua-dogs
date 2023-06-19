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
  }
}
export default hadnler;
