import {Member} from './MemberInterface'

export interface Comment {
  content: string
  sectiontype: any
  itemid: string
  id: string
  owner: Member
}
