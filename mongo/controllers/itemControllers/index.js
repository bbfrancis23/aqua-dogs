import db from '/mongo/db';

import Item from 'mongo/schemas/ItemSchema';
import Tag from '/mongo/schemas/TagSchema';
import Section from '/mongo/schemas/SectionSchema';
import { getSession } from 'next-auth/react';

import { ObjectId } from 'mongodb';

import axios from 'axios';

export const flattenItem = (item) => {
  delete item._id;

  // item.tags = item.tags.map((t) => {
  //   delete t._id;
  //   if (t.tagtype) {
  //     t.tagtype = t.tagtype.toString();
  //   }
  //   return t;
  // });

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

  item = await Item.findById(itemId).populate({
    path: 'sections',
    model: Section,
  });

  await db.disconnect();

  if (item) {
    item = await item.toObject({ getters: true, flattenMaps: true });

    item = await JSON.stringify(item);
    item = await JSON.parse(item);
  } else {
    item = undefined;
  }

  return item;
};

export const getItems = async () => {
  await db.connect();

  let items = {};

  items = await Item.find({ scope: 'public' }).populate({
    path: 'sections',
    model: Section,
  });

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

export const getItemsByTag = async (tagId) => {
  await db.connect();

  let items = [];

  try {
    items = await Item.find({ tags: new ObjectId(tagId.toString()) }).populate({
      path: 'sections',
      model: Section,
    });
  } catch (e) {
    // message = `Error finding Item: ${e}`;
  }

  if (items) {
    items = items.map((i) => {
      i = i.toObject({ getters: true });
      i = flattenItem(i);
      return i;
    });
  }

  await db.disconnect();
  return items;
};
