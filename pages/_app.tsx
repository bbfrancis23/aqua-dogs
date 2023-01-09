// import '../styles/globals.css'
import { useState, useEffect } from 'react'
import type { AppProps } from 'next/app'
import { CssBaseline, ThemeProvider, createTheme, Fab } from '@mui/material'
import { SnackbarProvider } from 'notistack'

import SettingsIcon from '@mui/icons-material/Settings'
import { appThemes, createFxTheme, palettes } from '../theme/themes'
import SettingsDialog from '../components/settings/SettingsDialog'

export default function App({ Component, pageProps }: AppProps) {

  const [settingsDialogIsOpen, setSettingsDialogIsOpen] = useState(false)


  const createFx = (fxOptions: any) => {
    let theme = createTheme(fxOptions)

    const globalTheme = {
      

      components: {

        MuiDialog: { styleOverrides: { root: { backgroundColor: 'rgba(0, 0, 0, 0.0)' } } },
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

  const handleUpdateFx = (options: any) => {
    let fxOptions:any = {}

    if (options) {
      fxOptions = localStorage.getItem('themeOptions')

      fxOptions = fxOptions ? (JSON.parse(fxOptions)) : {
        name: 'Hawaii',
        palette: palettes[0],

      }

      if (options.name) fxOptions.name = options.name
      if (options.palette) fxOptions.palette = options.palette
      if (options.mode) fxOptions.palette.mode = options.mode
    }

    setTheme(createFx(fxOptions))
    localStorage.setItem('themeOptions', JSON.stringify(fxOptions))
  }
 

  const [theme, setTheme] = useState(createFx( appThemes[0]))

  useEffect( () => {
    const themeOptions = localStorage.getItem('themeOptions')
    
    setTheme(createFx(themeOptions ? (JSON.parse(themeOptions)) : appThemes[0]))
  },[])



  return(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3} anchorOrigin={{horizontal: 'right', vertical: 'bottom'}} hideIconVariant={true}>
      <Fab
        color="secondary"
        sx={{
          position: 'fixed',
          top: theme.spacing(3),
          right: theme.spacing(3),
        }}
        onClick={() => setSettingsDialogIsOpen(true)}
      >
        <SettingsIcon />
      </Fab>
        <Component {...pageProps} />
        <SettingsDialog updateFx={handleUpdateFx} dialogIsOpen={settingsDialogIsOpen} closeDialog={ () => setSettingsDialogIsOpen(false)} /> 
      </SnackbarProvider>
    </ ThemeProvider>
    
   )
    
}
