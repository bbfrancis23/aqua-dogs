export enum AssessmentTypes {
  PRIORITY = 'priority',
  WORTH = 'worth',
  SIMPLICITY = 'simplicity',
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
