import {
  createTheme,
  ThemeOptions,
  PaletteOptions,
  PaletteColorOptions,
  SimplePaletteColorOptions,
} from '@mui/material'
import {
  lightBlue,
  red,
  teal,
  brown,
  blueGrey,
  grey,
  green,
  cyan,
  lightGreen,
  deepPurple,
  indigo,
  yellow,
} from '@mui/material/colors'

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    primaryAction: true
  }
}

export type FxPaletteColorOptions = PaletteColorOptions & {
  main: string
  darkMode?: string
  lightMode?: string
}

export interface FxPaletteOptions extends Omit<PaletteOptions, 'secondary' | 'primary'> {
  name: string
  secondary: FxPaletteColorOptions
  primary: FxPaletteColorOptions
}

export interface FxThemeOptions extends ThemeOptions {
  palette?: FxPaletteOptions
  name?: string
}

export const palettes: FxPaletteOptions[] = [
  {
    name: 'Hawaii',
    primary: {
      main: cyan[900],
      darkMode: cyan[700],
      lightMode: cyan[900],
    },
    secondary: {
      main: lightBlue[50],
      darkMode: lightBlue[100],
      lightMode: lightBlue[50],
    },
  },
  {
    name: 'Midnight',
    primary: {
      main: deepPurple[900],
      darkMode: deepPurple[400],
      lightMode: deepPurple[900],
    },
    secondary: {
      main: indigo[50],
      darkMode: indigo[100],
      lightMode: indigo[50],
    },
  },
  {
    name: 'Arizona',
    primary: {main: brown[500], darkMode: brown[300], lightMode: brown[500]},
    secondary: {main: teal[50], darkMode: teal[100], lightMode: teal[50]},
  },
  {
    name: 'Pirate',
    primary: {main: grey[900], lightMode: grey[900], darkMode: grey[500]},
    secondary: {main: grey[50], darkMode: grey[100], lightMode: grey[50]},
  },
  {
    name: 'Lush',
    primary: {main: green[900], lightMode: green[900], darkMode: green[500]},
    secondary: {
      main: lightGreen[50],
      darkMode: green[100],
      lightMode: green[50],
    },
  },
  {
    name: 'Corporate',
    primary: {main: blueGrey[900], lightMode: blueGrey[900], darkMode: blueGrey[200]},
    secondary: {
      main: grey[100],
      light: grey[50],
      darkMode: grey[100],
      lightMode: grey[50],
    },
  },
  {
    name: 'CobraKai',
    primary: {main: red[900], lightMode: red[900], darkMode: red[500]},
    secondary: {
      main: yellow[50],
      darkMode: yellow[100],
      lightMode: yellow[50],
    },
  },
  {
    name: 'AquaDogs',
    primary: {main: indigo[900], lightMode: indigo[900], darkMode: indigo[300]},
    secondary: {main: teal[50], darkMode: teal[100], lightMode: teal[50]},
  },
]

const getThemeOptions = (themeOptions: FxThemeOptions) => {
  if (!themeOptions) return themeOptions
  if (!themeOptions.palette) return themeOptions

  const palette = palettes.find((p) => p.name === themeOptions!.palette!.name)

  if (themeOptions.palette.mode === 'dark') {
    if (palette?.secondary?.darkMode)
      themeOptions.palette.secondary.main = palette?.secondary?.darkMode

    if (palette?.primary?.darkMode) themeOptions.palette.primary.main = palette?.primary?.darkMode
  } else {
    if (palette?.secondary?.lightMode)
      themeOptions.palette.secondary.main = palette?.secondary?.lightMode
    if (palette?.primary?.lightMode) themeOptions.palette.primary.main = palette?.primary?.lightMode
  }

  return themeOptions
}

export const createFxTheme = (themeOptions: FxThemeOptions) => {
  themeOptions = getThemeOptions(themeOptions)
  let theme = createTheme(themeOptions)

  const globalTheme = {
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
      MuiButton: {
        variants: [
          {
            props: {variant: 'primaryAction', color: 'primary'},
            style: {
              backgroundColor: '#ff0000',
            },
          },
        ],
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

  theme = createTheme(theme, globalTheme)
  return theme
}

export const hawaii = {palette: palettes[0]}
export const midnight = {palette: palettes[1]}
export const arizona = {palette: palettes[2]}
export const pirate = {palette: palettes[3]}
export const lush = {palette: palettes[4]}
export const corporate = {palette: palettes[5]}
export const cobraKai = {palette: palettes[6]}
export const aquaDogs = {palette: palettes[7]}
export const appThemes = [corporate, lush, pirate, arizona, midnight, hawaii, cobraKai, aquaDogs]

// QA: Done 8-3-2023
