export enum AssessmentTypes {
  WORTH = 'worth',
  COMPLEXITY = 'complexity',
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
