import { Board } from './BoardInterface';
import { Member } from './MemberInterface';

export interface Project {
  id: string;
  title: string;
  leader: Member;
  admins: Member[];
  members: Member[];
  boards: Board[];
}
