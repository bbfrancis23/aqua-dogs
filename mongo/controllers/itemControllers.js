import db from '/mongo/db';

import Item from '../schemas/ItemSchema';
import Tag from '/mongo/schemas/TagSchema';
import Section from '/mongo/schemas/SectionSchema';

export const flattenItem = (item) => {
  delete item._id;
  item.tags = item.tags.map((t) => {
    delete t._id;
    if (t.tagtype) {
      t.tagtype = t.tagtype.toString();
    }
    return t;
  });

  item.sections = item.sections.map((s) => {
    delete s._id;

    s.sectiontype = s.sectiontype.toString();
    s.itemid = s.itemid.toString();
    return s;
  });

  return item;
};

export const getItem = async (itemId) => {
  await db.connect();

  let item = {};

  item = await Item.findById(itemId)
    .populate({ path: 'tags', model: Tag })
    .populate({ path: 'sections', model: Section });

  await db.disconnect();

  if (item) {
    item = await item.toObject({ getters: true, flattenMaps: true });

    item = flattenItem(item);
  } else {
    item = undefined;
  }

  return item;
};

export const getItems = async () => {
  await db.connect();

  let items = {};

  items = await Item.find()
    .populate({ path: 'tags', model: Tag })
    .populate({ path: 'sections', model: Section });

  await db.disconnect();

  if (items) {
    items = items.map((i) => {
      i = i.toObject({ getters: true });
      i = flattenItem(i);
      return i;
    });
  } else {
    item = undefined;
  }

  return items;
};

// export const groupItemsByTag = (tagId) => {};
