// import '../styles/globals.css'
import { useState, useEffect } from 'react'
import type { AppProps } from 'next/app'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { SnackbarProvider } from 'notistack'

import { appThemes, createFxTheme, palettes } from '../theme/themes'

export default function App({ Component, pageProps }: AppProps) {

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

  
 

  const [theme, setTheme] = useState(createFx( appThemes[0]))

  useEffect( () => {
    const themeOptions = localStorage.getItem('themeOptions')
    
    setTheme(createFx(themeOptions ? (JSON.parse(themeOptions)) : appThemes[2]))
  },[])



  return(
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3} anchorOrigin={{horizontal: 'right', vertical: 'bottom'}} hideIconVariant={true}>
        <Component {...pageProps} />

      </SnackbarProvider>
    </ ThemeProvider>
    
   )
    
}
