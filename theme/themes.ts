import { createTheme } from '@mui/material';
import {
  lightBlue,
  red,
  teal,
  brown,
  blueGrey,
  grey,
  green,
  lightGreen,
  deepPurple,
  indigo,
  yellow,
  cyan,
} from '@mui/material/colors';

export const palettes = [
  {
    name: 'Hawaii',
    primary: { main: teal[800], light: teal[200], dark: teal[900] },
    secondary: { main: lightBlue[400], light: lightBlue[50] },
  },
  {
    name: 'Midnight',
    primary: { main: deepPurple[800] },
    secondary: { main: indigo[500], light: indigo[100] },
  },
  {
    name: 'Arizona',
    primary: { main: brown[400] },
    secondary: { main: teal[300] },
  },
  {
    name: 'Pirate',
    primary: { main: grey[900] },
    secondary: { main: red[900] },
  },
  {
    name: 'Lush',
    primary: { main: green[800] },
    secondary: { main: lightGreen[300] },
  },
  {
    name: 'Corporate',
    primary: { main: blueGrey[500] },
    secondary: { main: grey[400], light: grey[100] },
  },
  {
    name: 'CobraKai',
    primary: { main: red[900] },
    secondary: { main: yellow.A200 },
  },
  {
    name: 'AquaDogs',
    primary: { main: teal.A400 },
    secondary: { main: indigo[900] },
  },
];

export const createFxTheme = (themeOptions: any) => {
  let theme = createTheme(themeOptions);

  const globalTheme = {
    components: {
      MuiDialog: {
        styleOverrides: { root: { backgroundColor: 'rgba(0, 0, 0, 0.0)' } },
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
  theme = createTheme(theme, globalTheme);
  return theme;
};

export const hawaii = { name: 'Hawaii', palette: palettes[0] };
export const midnight = { name: 'Midnight', palette: palettes[1] };
export const arizona = { name: 'Arizona', palette: palettes[2] };
export const pirate = { name: 'Pirate', palette: palettes[3] };
export const lush = { name: 'Lush', palette: palettes[4] };
export const corporate = { name: 'Corporate', palette: palettes[5] };
export const cobraKai = { name: 'CobraKai', palette: palettes[6] };
export const aquaDogs = { name: 'AquaDogs', palette: palettes[7] };
export const appThemes = [
  corporate,
  lush,
  pirate,
  arizona,
  midnight,
  hawaii,
  cobraKai,
  aquaDogs,
];
