import {Board} from '../board'
import {Item} from '../item'

export interface Column {
  id: string
  title: string
  items: Item[]
}

export type ColumnResponse = {
  message: string
  column?: Column | null | undefined
  board?: Board | null | undefined
}

// QA: Done 10-20-2023
