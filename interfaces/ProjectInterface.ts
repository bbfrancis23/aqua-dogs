import {Dispatch, SetStateAction, createContext} from 'react'
import {Board} from './BoardInterface'
import {Member} from './MemberInterface'

export interface Project {
  id: string
  title: string
  leader: Member
  admins?: Member[]
  members?: Member[]
  boards?: Board[]
  archived?: boolean
}

export interface ProjectContextProps {
  project: Project
  setProject: Dispatch<SetStateAction<Project>> | (() => {})
}

export const ProjectContext = createContext<ProjectContextProps>({} as ProjectContextProps)
