import {Board} from './BoardInterface'
import {Item} from './ItemInterface'

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

// QA: Done 8-3-2023
