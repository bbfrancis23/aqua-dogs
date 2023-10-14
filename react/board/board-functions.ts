import {Board} from './board-types'

export const getBoardDirectory = (board: Board): string =>
  board.title.toLowerCase().replace(/[^a-z]/g, '')
