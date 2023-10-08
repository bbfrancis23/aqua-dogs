export interface NewActivity {
  title: string
  description?: string
}

export interface Activity extends NewActivity {
  id: number
  createdAt: Date
}
