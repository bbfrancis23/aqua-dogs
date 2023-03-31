import db from '/mongo/db';
import Item from '/mongo/schemas/ItemSchema';
import Tag from '/mongo/schemas/TagSchema';
import Section from '/mongo/schemas/SectionSchema';
import { getSession } from 'next-auth/react';
import { ObjectId } from 'mongodb';

export async function getTags() {
  let status = 200;
  let message = '';

  await db.connect();

  let tags = await Tag.find();

  await db.disconnect();

  if (tags) {
    tags = tags.map((t) => {
      t = t.toObject({ getters: true });
      t = flattenTag(t);
      return t;
    });
  } else {
    status: 404;
    message = 'Not found';
    tags = undefined;
  }

  return {
    status: status,
    message: message,
    tags: tags,
  };
}

export function flattenTag(tag) {
  delete tag._id;
  if (tag.tagtype) {
    tag.tagtype = tag.tagtype.toString();
  }
  return tag;
}
