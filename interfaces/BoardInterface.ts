import {Dispatch, SetStateAction, createContext} from 'react'
import {Column} from './Column'
import {Scope} from './Scope'

export interface Board {
  id: string
  title: string
  scope?: Scope
  columns: Column[]
  directoryId?: string
}

export interface BoardContextProps {
  board: Board
  setBoard: Dispatch<SetStateAction<Board>> | (() => {})
}

export const BoardContext = createContext<BoardContextProps>({} as BoardContextProps)

// QA: Brian Francis 8-10-23
