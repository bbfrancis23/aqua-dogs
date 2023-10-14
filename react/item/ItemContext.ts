import {createContext} from 'react'
import {ItemContextProps} from './item-types'

export const ItemContext = createContext<ItemContextProps>({} as ItemContextProps)
export default ItemContext
