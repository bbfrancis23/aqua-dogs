import { Item } from './ItemInterface';

export interface Column {
  id: string;
  title: string;
  items: Item[];
}
