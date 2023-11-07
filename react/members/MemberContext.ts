import {Dispatch, SetStateAction, createContext} from 'react'
import {Member} from './member-types'

export interface MemberContextProps {
  member: Member
  setMember: Dispatch<SetStateAction<Member>> | (() => {})
}

export const MemberContext = createContext<MemberContextProps>({} as MemberContextProps)
// QA: Brian Francis 8-13-23
