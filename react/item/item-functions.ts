import {Item} from './item-types'

export const getItemDirectory = (item: Item): string =>
  item.title
    .toLocaleLowerCase()
    .trim()
    .replace(/ /g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
