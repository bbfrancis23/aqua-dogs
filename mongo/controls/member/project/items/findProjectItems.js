import db from '/mongo/db';

import Board from '/mongo/schemas/BoardSchema';
// import Project from '/mongo/schemas/ProjectSchema';

import Column from '/mongo/schemas/ColumnSchema';
import Item from '/mongo/schemas/ItemSchema';

import Section from '/mongo/schemas/SectionSchema';

export const findProjectItems = async (projectId) => {
  let items = [];

  await db.connect();

  const boards = await Board.find({ project: projectId }).populate({
    path: 'columns',
    populate: { path: 'items', model: Item },
  });

  boards.forEach((b) => {
    b.columns.forEach((c) => {
      items = items.concat(c.items);
    });
  });

  items = await JSON.stringify(items);
  items = await JSON.parse(items);
  await db.disconnect();

  return items;
};

export default findProjectItems;
