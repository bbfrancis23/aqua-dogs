import db from '/mongo/db';

import Item from '/mongo/schemas/ItemSchema';
import Tag from '/mongo/schemas/TagSchema';
import Section from '/mongo/schemas/SectionSchema';
import { ObjectId } from 'mongodb';

export function flattenItem(item) {
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
}

export async function getItem(itemId) {
  let status = 200;
  let message = '';

  await db.connect();

  let item;

  try {
    item = await Item.findById(itemId)
      .populate({ path: 'tags', model: Tag })
      .populate({ path: 'sections', model: Section });
  } catch (e) {
    message = `Error finding Item: ${e}`;
    status = 500;
  }

  if (status === 200) {
    if (!item) {
      status === 404;
      message = `Item: ${itemId} not found.`;
    }
  }

  await db.disconnect();

  if (item) {
    item = await item.toObject({ getters: true, flattenMaps: true });

    item = flattenItem(item);
  } else {
    item = undefined;
  }

  return {
    status: status,
    message: message,
    item: item,
  };
}

export async function getItems() {
  let status = 200;
  let message = '';

  await db.connect();

  let items = await Item.find()
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
    status: 404;
    message = 'Not';
    item = undefined;
  }

  return {
    status: status,
    message: message,
    items: items,
  };
}

export async function groupItemsByTag(tagId) {
  let status = 200;
  let message = '';

  await db.connect();

  let items;

  try {
    items = await Item.find({ tags: new ObjectId(tagId.toString()) })
      .populate({ path: 'tags', model: Tag })
      .populate({ path: 'sections', model: Section });
  } catch (e) {
    message = `Error finding Item: ${e}`;
    status = 500;
  }

  if (items) {
    items = items.map((i) => {
      i = i.toObject({ getters: true });
      i = flattenItem(i);
      return i;
    });
  } else {
    status: 404;
    message = 'Not';
    item = undefined;
  }

  return {
    status: status,
    message: message,
    items: items,
  };
}
