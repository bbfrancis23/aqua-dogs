import { Member } from './MemberInterface';
import { Tag } from './TagInterface';

export interface Org {
  id: string;
  title: string;
  leader?: Member;
  admins?: Member[];
  members?: Member[];
  tags?: Tag[];
}
