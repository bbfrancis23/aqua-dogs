// import '../styles/globals.css'
import { useState, useEffect } from 'react'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { SnackbarProvider } from 'notistack'

import { 
  CssBaseline, ThemeProvider, createTheme, AppBar, Toolbar, Typography, Box, IconButton, Menu, 
  MenuItem, Button
} from '@mui/material'

import SettingsIcon from '@mui/icons-material/Settings'

import { appThemes,  palettes } from '../theme/themes'

import SettingsDialog from '../components/settings/SettingsDialog'
import AuthDialog from '../components/auth/AuthDialog'
import AppBarMenu from '../ui/AppBarMenu'

import { tags } from '../data/tags';


export default function App({ Component, pageProps: { session, ...pageProps }, }: AppProps) {


  const webFrameWorkPages  = tags.slice(0, 3);
  const frontEndPages  = tags.slice(3, 6);
  const backEndPages = tags.slice(6,9)

  const [anchorEl, setAnchorEl] = useState(null); 
  const [settingsDialogIsOpen, setSettingsDialogIsOpen] = useState(false)  
  const [authDialogIsOpen, setAuthDialogIsOpen] = useState(false)

  const handleCloseMenu = () => setAnchorEl(null)

  const handleOpenAuthDialog = () =>{
    setAuthDialogIsOpen(true)
    handleCloseMenu()
  }

  const handleOpenSettingsDialog = () => {
    setSettingsDialogIsOpen(true)
    handleCloseMenu()
  }

  const handleMenu = (event: any) =>   setAnchorEl(event.currentTarget)

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
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={1} anchorOrigin={{horizontal: 'right', vertical: 'bottom'}} hideIconVariant={true}>
          <AppBar >
            <Toolbar>
              <Typography
                variant="h6"
                noWrap
                component="div"
              >
                AquaDogs
              </Typography>
              <AppBarMenu name="WEB FRAMEWORK" id="web-framework" pages={webFrameWorkPages}/>
              <AppBarMenu name="FRONTEND" id="fontend" pages={frontEndPages} />
              <AppBarMenu name="BACKEND" id="backend" pages={backEndPages} />
              <Box sx={{ flexGrow: 1 }} />
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                color="inherit"
                onClick={handleMenu}
              >
                <SettingsIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
              >
                  <MenuItem onClick={handleOpenAuthDialog} >LOGIN</MenuItem>
                  <MenuItem onClick={() => setSettingsDialogIsOpen(true)}>SETTINGS</MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>       
        <Component {...pageProps} />
        <SettingsDialog updateFx={handleUpdateFx} dialogIsOpen={settingsDialogIsOpen} closeDialog={ () => setSettingsDialogIsOpen(false)} /> 
        <AuthDialog dialogIsOpen={authDialogIsOpen} closeDialog={ () => setAuthDialogIsOpen(false)} /> 
        </SnackbarProvider>
      </ ThemeProvider>
    </SessionProvider>
    
   )
    
}


