import {Dispatch, SetStateAction, createContext} from 'react'

import {Board} from '../react/board/board-types'
import {Member} from './MemberInterface'

export interface Project {
  id: string
  title: string
  leader: Member
  admins?: Member[]
  members?: Member[]
  boards?: Board[]
  archive?: boolean
}

export interface ProjectContextProps {
  project: Project
  setProject: Dispatch<SetStateAction<Project>> | (() => {})
  setItemDialogIsOpen?: Dispatch<SetStateAction<boolean>> | (() => {})
  setSelectedItem?: Dispatch<SetStateAction<null | string>>
}

export const ProjectContext = createContext<ProjectContextProps>({} as ProjectContextProps)

// QA: Brian Francis 8-10-23
