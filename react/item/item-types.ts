import {Dispatch, SetStateAction, createContext} from 'react'
import {Section} from '../section/section-types'
import {Comment} from '../comments/comment-types'

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

// QA done 8-3-23
