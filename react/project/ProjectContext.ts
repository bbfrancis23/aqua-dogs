import {Dispatch, SetStateAction, createContext} from 'react'
import {Project} from './project-types'

export interface ProjectContextProps {
  project: Project
  setProject: Dispatch<SetStateAction<Project>> | (() => {})
  setItemDialogIsOpen?: Dispatch<SetStateAction<boolean>> | (() => {})
  setSelectedItem?: Dispatch<SetStateAction<null | string>>
}

export const ProjectContext = createContext<ProjectContextProps>({} as ProjectContextProps)
