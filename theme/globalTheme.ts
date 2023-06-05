import { Theme } from '@mui/material';

export interface FxTheme extends Theme {
  passwordMinLength: number;
  pageContentTopPadding: number;
}

export const globalTheme = {
  passwordMinLength: 6,
  pageContentTopPadding: 12,
  components: {
    MuiDialog: {
      styleOverrides: { root: { backgroundColor: 'rgba(0, 0, 0, 0.0)' } },
    },
    MuiCardHeader: {
      styleOverrides: { title: { fontSize: '2rem', fontWeight: '800' } },
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
};
