import {FxCheckbox} from '../checklist/checklist-types'

export interface Section {
  content: string
  sectiontype: any
  itemid: string
  checkboxes?: FxCheckbox[]
  id: string
}

export enum SectionTypes {
  CODE = '63b88d18379a4f30bab59bad',
  TEXT = '63b88d18379a4f30bab59bac',
  CHECKLIST = '6563a7fdbf30bb677e252c56',
}

// QA: Brian Francis 10-20-23
