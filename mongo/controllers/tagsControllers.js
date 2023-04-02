import db from '/mongo/db';
import Tag from '/mongo/schemas/TagSchema';

export function flattenTag(tag) {
  delete tag._id;
  if (tag.tagtype) {
    tag.tagtype = tag.tagtype.toString();
  }
  return tag;
}

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
