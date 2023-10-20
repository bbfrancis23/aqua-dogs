import {Member} from '../react/members/member-types'

export interface Comment {
  content: string
  sectiontype: any
  itemid: string
  id: string
  owner: Member
}
