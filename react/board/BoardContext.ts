import {createContext} from 'react'
import {BoardContextProps} from './board-types'

export const BoardContext = createContext<BoardContextProps>({} as BoardContextProps)
export default BoardContext

// QA: Brian Francis - 10-24-23
