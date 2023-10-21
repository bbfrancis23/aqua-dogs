import {Dispatch, SetStateAction} from 'react'
import {Section} from '../section'
import {Comment} from '../comments'

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

// QA done 10-20-23
