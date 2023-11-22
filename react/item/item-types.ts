import {Dispatch, SetStateAction} from 'react'
import {Section} from '../section'
import {Comment} from '../comments'
import {AssessmentTypes, AssessmentValues} from '../assessments/assessment-types'

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
  worth?: AssessmentValues
  difficulty?: AssessmentValues
  priority?: AssessmentValues
}

export interface ItemContextProps {
  item: Item | undefined
  setItem: Dispatch<SetStateAction<Item>> | (() => {})
}

// QA done 11-22-23
