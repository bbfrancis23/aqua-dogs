import {createTheme, Palette} from '@mui/material'
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
import {globalTheme} from './globalTheme'

export const palettes = [
  {
    name: 'Hawaii',
    primary: {main: cyan[900], light: cyan[500]},
    secondary: {
      main: lightBlue[50],
      darkMode: lightBlue[100],
      lightMode: lightBlue[50],
    },
  },
  {
    name: 'Midnight',
    primary: {main: deepPurple[900], light: deepPurple[400]},
    secondary: {
      main: indigo[50],
      darkMode: indigo[100],
      lightMode: indigo[50],
    },
  },
  {
    name: 'Arizona',
    primary: {main: brown[500]},
    secondary: {main: teal[50], darkMode: teal[100], lightMode: teal[50]},
  },
  {
    name: 'Pirate',
    primary: {main: grey[900], light: grey[500]},
    secondary: {main: grey[50], darkMode: grey[100], lightMode: grey[50]},
  },
  {
    name: 'Lush',
    primary: {main: green[900], light: green[500]},
    secondary: {
      main: lightGreen[50],
      darkMode: green[100],
      lightMode: green[50],
    },
  },
  {
    name: 'Corporate',
    primary: {main: blueGrey[500], light: blueGrey[500]},
    secondary: {
      main: grey[100],
      light: grey[50],
      darkMode: grey[100],
      lightMode: grey[50],
    },
  },
  {
    name: 'CobraKai',
    primary: {main: red[900], light: red[500]},
    secondary: {
      main: yellow[50],
      darkMode: yellow[100],
      lightMode: yellow[50],
    },
  },
  {
    name: 'AquaDogs',
    primary: {main: indigo[900], light: indigo[400]},
    secondary: {main: teal[50], darkMode: teal[100], lightMode: teal[50]},
  },
]

const getThemeOptions = (themeOptions: any) => {
  const palette = palettes.find((p) => p.name === themeOptions.palette.name)
  if (themeOptions.palette.mode === 'dark') {
    themeOptions.palette.secondary.main = palette?.secondary.darkMode
  } else {
    themeOptions.palette.secondary.main = palette?.secondary.lightMode
  }

  return themeOptions
}

export const createFxTheme = (themeOptions: any) => {
  themeOptions = getThemeOptions(themeOptions)
  let theme = createTheme(themeOptions)

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
