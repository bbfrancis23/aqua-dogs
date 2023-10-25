import {DraggableLocation} from 'react-beautiful-dnd'
import {Column} from '../column'
import {Board} from './'

export const getBoardDirectory = (board: Board | string): string => {
  if (typeof board === 'string') {
    return board.toLowerCase().replace(/[^a-z]/g, '')
  } else {
    return board.title.toLowerCase().replace(/[^a-z]/g, '')
  }
}

export interface reorderArrayProps {
  array: any[]
  startIndex: number
  endIndex: number
}

export interface ColumnKeyArray {
  [key: string]: Column
}

export const reorderArray = ({array, startIndex, endIndex}: reorderArrayProps): any[] => {
  if (!array) return []
  const result: any[] = Array.from(array)

  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

export interface ReorderBoardProps {
  boardCols: ColumnKeyArray
  source: DraggableLocation
  destination: DraggableLocation
}

export const reorderBoard = ({boardCols, source, destination}: ReorderBoardProps) => {
  const sourceId = source.droppableId
  const destinationId = destination.droppableId

  const sourceCol = {...boardCols[sourceId]}
  const destinationCol = {...boardCols[destinationId]}
  const targetItem = sourceCol.items[source.index]

  if (sourceId === destinationId) {
    let ordered = {...sourceCol}

    const orderColProps = {
      array: sourceCol.items,
      startIndex: source.index,
      endIndex: destination.index,
    }

    ordered.items = reorderArray(orderColProps)
    boardCols = {...boardCols, [sourceId]: ordered}
    return boardCols
  }
  sourceCol.items.splice(source.index, 1)
  destinationCol.items.splice(destination.index, 0, targetItem)
  boardCols = {...boardCols, [sourceId]: sourceCol, [destinationId]: destinationCol}

  return boardCols
}

// QA: Brian Francis 10-23-23
