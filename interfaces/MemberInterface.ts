import { Tag } from './TagInterface';

export interface Member {
  email: string;
  name?: string;
  roles?: string[];
  id: string;
  tags: Tag[];
}
