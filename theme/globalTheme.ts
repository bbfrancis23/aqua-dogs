import {Theme} from '@mui/material'

export interface FxTheme extends Theme {
  passwordMinLength: number
  pageContentTopPadding: number
}

export const globalTheme = {
  passwordMinLength: 6,
  pageContentTopPadding: 6,
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
