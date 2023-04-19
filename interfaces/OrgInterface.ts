import { Member } from './MemberInterface';

export interface Org {
  id: string;
  title: string;
  leader?: Member;
  admins?: Member[];
  members?: Member[];
}
