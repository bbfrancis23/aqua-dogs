import {Dispatch, SetStateAction, createContext} from 'react'
export interface Member {
  email: string
  name?: string
  id: string
}

export interface MemberContextProps {
  member: Member
  setMember: Dispatch<SetStateAction<Member>> | (() => {})
}

export const MemberContext = createContext<MemberContextProps>({} as MemberContextProps)
// QA: Brian Francis 8-13-23
