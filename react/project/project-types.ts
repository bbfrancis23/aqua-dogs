import {Board} from '../board/board-types'
import {Member} from '../members/member-types'

export interface Project {
  id: string
  title: string
  leader: Member
  admins?: Member[]
  members?: Member[]
  boards?: Board[]
  archive?: boolean
}

// QA: Brian Francis 10-30-23
