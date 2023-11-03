import {Dispatch, SetStateAction, createContext} from 'react'
import {PaletteColorOptions, PaletteOptions, Theme, ThemeOptions} from '@mui/material'
import {createTheme} from '@mui/material/styles'
import {
  blueGrey,
  brown,
  cyan,
  deepPurple,
  green,
  grey,
  indigo,
  lightBlue,
  lightGreen,
  orange,
  red,
  teal,
  yellow,
} from '@mui/material/colors'
import {FxThemeGlobals} from './globalTheme'

export type FxPaletteColorOptions = PaletteColorOptions & {
  main?: string
  50?: string
  100?: string
  500?: string
  800?: string
  900?: string
}
export interface FxPaletteOptions extends Omit<PaletteOptions, 'secondary' | 'primary'> {
  secondary: FxPaletteColorOptions
  primary: FxPaletteColorOptions
}
export enum FxThemeNames {
  Ocean = 'Ocean',
  Night = 'Night',
  Desert = 'Desert',
  Forest = 'Forest',
  Corporate = 'Corporate',
  Pirate = 'Pirate',
  CobraKai = 'CobraKai',
  Sunset = 'Sunset',
  default = 'default',
}

export interface FxTheme {
  name: FxThemeNames
  theme: FxThemeGlobals
}

export interface FxThemeProps {
  fxTheme: FxTheme
  setFxTheme: Dispatch<SetStateAction<FxTheme>> | (() => {})
}

export const FxThemeContext = createContext<FxThemeProps>({} as FxThemeProps)

export interface FxThemeOptions extends ThemeOptions {
  palette: FxPaletteOptions
  name: FxThemeNames
}

export const fxThemeOptionsList: FxThemeOptions[] = [
  {
    name: FxThemeNames.Corporate,
    palette: {
      primary: blueGrey,
      secondary: grey,
    },
  },
  {
    name: FxThemeNames.Ocean,
    palette: {
      primary: cyan,
      secondary: lightBlue,
    },
  },
  {
    name: FxThemeNames.Night,
    palette: {
      primary: deepPurple,
      secondary: indigo,
    },
  },
  {
    name: FxThemeNames.Desert,
    palette: {
      primary: brown,
      secondary: orange,
    },
  },
  {
    name: FxThemeNames.Forest,
    palette: {
      primary: green,
      secondary: lightGreen,
    },
  },

  {
    name: FxThemeNames.Pirate,
    palette: {
      primary: red,
      secondary: grey,
    },
  },
  {
    name: FxThemeNames.CobraKai,
    palette: {
      primary: red,
      secondary: yellow,
    },
  },
  {
    name: FxThemeNames.Sunset,
    palette: {
      primary: orange,
      secondary: yellow,
    },
  },
]

const getPaletteOptions = (themeOptions: FxThemeOptions) => {
  if (!themeOptions) return themeOptions
  if (!themeOptions.palette) return themeOptions

  if (themeOptions.palette.mode === 'dark') {
    themeOptions.palette.primary.main = themeOptions.palette.primary[500]
    themeOptions.palette.secondary.main = themeOptions.palette.secondary[100]
  } else if (themeOptions.palette.mode === 'light') {
    themeOptions.palette.primary.main = themeOptions.palette.primary[900]
    themeOptions.palette.secondary.main = themeOptions.palette.secondary[50]
  }

  return themeOptions
}

export const createFxTheme = (fxThemeOptions: FxThemeOptions): FxTheme => {
  fxThemeOptions = getPaletteOptions(fxThemeOptions)
  let theme = createTheme({palette: fxThemeOptions.palette} as ThemeOptions)

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
          root: ({theme}: {theme: Theme}) =>
            theme.unstable_sx({
              border: '1px solid',
              borderColor: theme.palette.divider,
              boxShadow: 0,
            }),
        },
      },
      MuiCardHeader: {
        styleOverrides: {
          title: {fontSize: '2rem', fontWeight: '800'},

          root: ({ownerState, theme}: any) => ({
            ...(ownerState.color === 'primary' && {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            }),
            ...(ownerState.color === 'secondary' && {
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.secondary.contrastText,
            }),
          }),
        },
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
  return {name: fxThemeOptions.name, theme: theme as FxThemeGlobals}
}

export const defaultFxTheme = createFxTheme({
  name: FxThemeNames.default,
  palette: {
    primary: blueGrey,
    secondary: {main: grey[100]},
  },
})

export interface UpdateThemeOptionsProps {
  name?: string
  mode?: string
}
