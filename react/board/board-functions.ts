import {Board} from './board-types'

export const getBoardDirectory = (board: Board | string): string => {
  if (typeof board === 'string') {
    return board.toLowerCase().replace(/[^a-z]/g, '')
  } else {
    return board.title.toLowerCase().replace(/[^a-z]/g, '')
  }
}
