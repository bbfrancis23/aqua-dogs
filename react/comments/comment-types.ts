import {Member} from '../members'

export interface Comment {
  content: string
  sectiontype: any
  itemid: string
  id: string
  owner: Member
}

// QA: Brian Francis 10-20-23
