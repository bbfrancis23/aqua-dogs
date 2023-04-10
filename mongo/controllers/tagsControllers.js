import db from '/mongo/db';
import Tag from '/mongo/schemas/TagSchema';

export const flattenTag = (tag) => {
  delete tag._id;
  if (tag.tagtype) {
    tag.tagtype = tag.tagtype.toString();
  }
  return tag;
};

export const getTags = async () => {
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
    tags = undefined;
  }

  return tags;
};

export const getTag = async (tagId) => {
  await db.connect;

  let tag = await Tag.findById(tagId);

  await db.disconnect();

  if (tag) {
    tag = await tag.toObject({ getters: true });
    tag = flattenTag(tag);
  } else {
    tag = undefined;
  }

  return tag;
};
