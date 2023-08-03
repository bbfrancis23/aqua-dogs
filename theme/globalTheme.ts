import {Theme, Palette} from '@mui/material'

export interface FxTheme extends Theme {
  passwordMinLength: number
  pageContentTopPadding: number
  defaultPadding: number
}

export interface FxPalette extends Palette {
  name: string
}

export const globalTheme = {
  passwordMinLength: 6,
  pageContentTopPadding: 3,
  defaultPadding: 3,
  components: {
    MuiDialog: {
      styleOverrides: {root: {backgroundColor: 'rgba(0, 0, 0, 0.0)'}},
    },
    MuiCard: {
      styleOverrides: {
        root: ({theme}: any) =>
          theme.unstable_sx({
            border: '1px solid',
            borderColor: theme.palette.divider,
            boxShadow: 0,
          }),
      },
    },
    MuiCardHeader: {
      styleOverrides: {title: {fontSize: '2rem', fontWeight: '800'}},
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(1px)',
          backgroundColor: 'rgba(0, 0, 0, 0.0)',
        },
      },
    },
  },
}

// QA: Done 8-3-2023
