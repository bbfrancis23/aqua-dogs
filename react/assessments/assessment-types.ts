export enum AssessmentTypes {
  WORTH = 'worth',
  DIFFICULTY = 'difficulty',
  PRIORITY = 'priority',
}

export enum AssessmentValues {
  LOW = 'LOW',
  MED = 'MED',
  HIGH = 'HIGH',
}

export interface Assessment {
  type: AssessmentTypes
  value: AssessmentValues
}
