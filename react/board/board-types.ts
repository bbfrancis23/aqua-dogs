import {Dispatch, SetStateAction} from 'react'
import {Column} from '../column'
import {Scope} from '../scope'

export interface Board {
  id: string
  title: string
  scope?: Scope
  columns: Column[]
  description?: string
  directoryId?: string
  project?: string
}

export interface BoardContextProps {
  board: Board
  setBoard?: Dispatch<SetStateAction<Board>> | (() => {})
}

// QA: Brian Francis 10-20-23
