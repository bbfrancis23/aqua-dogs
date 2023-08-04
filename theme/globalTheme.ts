import {Theme, Palette} from '@mui/material'

export interface FxPalette extends Palette {
  name: string
}

export interface FxTheme extends Omit<Theme, 'palette'> {
  passwordMinLength: number
  pageContentTopPadding: number
  defaultPadding: number
  palette: FxPalette
}

// QA: Done 8-3-2023
