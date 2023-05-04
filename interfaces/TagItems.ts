import { Item } from './ItemInterface';
import { Tag } from './TagInterface';

export interface TagItems {
  tag: Tag;
  items: Item[];
}

export const getTagItems = (tag: Tag, items: Item[]) => {
  let tagItems: TagItems[] = [];

  items.forEach((i: Item) => {
    if (i.tags) {
      i.tags.forEach((t: Tag) => {
        if (t.id !== tag.id) {
          let found = false;
          let index: number | null = null;
          tagItems.forEach((ti: TagItems, tiIndex: number) => {
            if (ti.tag.id === t.id) {
              found = true;
              index = tiIndex;
            }
          });

          if (!found) {
            tagItems.push({ tag: t, items: [i] });
          } else {
            if (index !== null) {
              tagItems[index].items.push(i);
            }
          }
        }
      });
    }
  });

  return tagItems;
};
