import {Dispatch, SetStateAction, createContext} from 'react'
import {Section} from './SectionInterface'
import {Comment} from './CommentInterface'

export interface Item {
  title: string
  sections?: Section[]
  upvotes?: string[]
  downvotes?: string[]
  rating?: number
  id: string
  owners: string[]
  directioryId?: string
  comments?: Comment[]
}

export interface ItemContextProps {
  item: Item | undefined
  setItem: Dispatch<SetStateAction<Item>> | (() => {})
}

export const ItemContext = createContext<ItemContextProps>({
  item: undefined,
  setItem: () => {},
})

// QA done 8-3-23
