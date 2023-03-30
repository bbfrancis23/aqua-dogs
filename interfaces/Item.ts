import { Section } from './Section';
import { Tag } from './Tag';

export interface Item {
  title: string;
  tags?: Tag[];
  sections?: Section[];
  upvotes?: string[];
  downvotes?: string[];
  id: string;
}
