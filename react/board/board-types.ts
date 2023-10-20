import {Dispatch, SetStateAction, createContext} from 'react'
import {Column} from '../column/column-types'
import Scope from '../scope/scope-types'

export interface Board {
  id: string
  title: string
  scope?: Scope
  columns: Column[]
  description?: string
  directoryId?: string
}

export interface BoardContextProps {
  board: Board
  setBoard: Dispatch<SetStateAction<Board>> | (() => {})
}

// QA: Brian Francis 8-12-23
