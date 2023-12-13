import {Dispatch, SetStateAction, createContext} from 'react'
import {Section} from './section-types'

export interface SectionContextProps {
  section: Section | undefined
  setSection: Dispatch<SetStateAction<Section>> | (() => {})
}

export const SectionContext = createContext<SectionContextProps>({} as SectionContextProps)
export default SectionContext
