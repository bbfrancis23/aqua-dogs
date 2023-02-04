// import '../styles/globals.css'
import { useState, useEffect } from 'react'

import { CssBaseline, ThemeProvider,  AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import WebFrameworkIcon from '@mui/icons-material/Language';
import FrontEndIcon from '@mui/icons-material/Code';
import BackEndIcon from '@mui/icons-material/DataObject';

import type { AppProps } from 'next/app'
import Link from 'next/link'
import { SessionProvider } from "next-auth/react"

import { SnackbarProvider} from 'notistack'

import { appThemes,  palettes, createFxTheme } from '../theme/themes'
import AppBarMenu from '../ui/AppBarMenu'
import SettingsDialog from '../components/settings/SettingsDialog'
import AuthDialog from '../components/auth/AuthDialog'
import AuthNav from '../components/auth/AuthNav'
import { tags } from '../data/tags';

export default function App({ Component, pageProps: { session, ...pageProps }, }: AppProps) {

  const webFrameWorkPages  = tags.slice(0, 3);
  const frontEndPages  = tags.slice(3, 6);
  const backEndPages = tags.slice(6,9)
  const [settingsDialogIsOpen, setSettingsDialogIsOpen] = useState(false)  
  const [authDialogIsOpen, setAuthDialogIsOpen] = useState(false)    
  
  const [theme, setTheme] = useState(createFxTheme( appThemes[0]))
  
  const handleUpdateTheme = (options: any) => {
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
      else fxOptions.palette.mode = theme.palette.mode
    }

    setTheme(createFxTheme(fxOptions))
    localStorage.setItem('themeOptions', JSON.stringify(fxOptions))
  }
  useEffect( () => {
    const themeOptions = localStorage.getItem('themeOptions')
    
    setTheme(createFxTheme(themeOptions ? (JSON.parse(themeOptions)) : appThemes[0]))
  },[]) 

  return(
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3} anchorOrigin={{horizontal: 'right', vertical: 'bottom'}} hideIconVariant={true}>
          <AppBar enableColorOnDark>
            <Toolbar>
              <Link href={'http://localhost:3000/'} style={{textDecoration: 'none'}} >
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ color: 'primary.contrastText'}}
              >                
                AquaDogs
              </Typography>
              </Link>
              <AppBarMenu name="WEB FRAMEWORK" id="web-framework" pages={webFrameWorkPages} icon={<WebFrameworkIcon />} />
              <AppBarMenu name="FRONTEND" id="fontend" pages={frontEndPages} icon={<FrontEndIcon />} />
              <AppBarMenu name="BACKEND" id="backend" pages={backEndPages} icon={<BackEndIcon />} />
              <Box sx={{ flexGrow: 1 }} />
              <AuthNav  setAuthDialogIsOpen={setAuthDialogIsOpen} />
              <IconButton
                size="large"
                edge="end"
                aria-label="app settings"
                aria-haspopup="true"
                color="inherit"
                onClick={() => setSettingsDialogIsOpen(true)}
              >
                <SettingsIcon />
              </IconButton>            
            </Toolbar>
          </AppBar>       
        <Component {...pageProps} />
        <SettingsDialog updateFx={handleUpdateTheme} dialogIsOpen={settingsDialogIsOpen} closeDialog={ () => setSettingsDialogIsOpen(false)} /> 
        <AuthDialog dialogIsOpen={authDialogIsOpen} closeDialog={ () => setAuthDialogIsOpen(false)} /> 
        </SnackbarProvider>
      </ ThemeProvider>
    </SessionProvider>
    
   )
    
}


