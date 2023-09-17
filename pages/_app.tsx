import {useState, useEffect} from "react"

import type {AppProps} from "next/app"
import Link from "next/link"
import Image from "next/image"
import {SessionProvider} from "next-auth/react"

import { CssBaseline, ThemeProvider, AppBar, Toolbar, Typography, Box,
  IconButton} from "@mui/material"
import {ConfirmProvider} from "material-ui-confirm"
import SettingsIcon from "@mui/icons-material/Settings"
import {SnackbarProvider} from "notistack"

import {appThemes, palettes, createFxTheme, FxThemeOptions, FxPaletteOptions} from "../theme/themes"

import AuthNav from "@/components/auth/AuthNav"
import AppBarMenu, {AppBarMenuProps} from "@/components/AppBarMenu"


import SettingsDialog from "@/components/settings/SettingsDialog"
import RegisterDialog from "@/components/auth/dialogs/RegisterDialog"


import AuthDialog from "@/components/auth/dialogs/AuthDialog"
import ForgotPasswordDialog from "@/components/auth/dialogs/ForgotPasswordDialog"


import {appMenuItems} from "../data/appMenuItems"

import '../styles/globals.css'
import { useRouter } from "next/router"
import Loading from "./Loading"

export interface UpdateThemeOptionsProps {
  palette: FxPaletteOptions
  name?: string
  mode?: string
}
/* eslint-disable */
export default function App({Component, pageProps: {session, ...pageProps},}: AppProps) {

  const [settingsDialogIsOpen, setSettingsDialogIsOpen] = useState(false)
  const [authDialogIsOpen, setAuthDialogIsOpen] = useState(false)
  const [regDialogIsOpen, setRegDialogIsOpen] = useState(false)
  const [forgotDialogIsOpen, setForgotDialogIsOpen] = useState(false)

  const [theme, setTheme] = useState(createFxTheme( appThemes[0]))

  const handleUpdateTheme = (options: UpdateThemeOptionsProps) => {
    let fxOptions: any = { }

    if (options) {
      let fxOptionsJSON = localStorage.getItem("themeOptions")

      fxOptions = fxOptionsJSON ? (JSON.parse(fxOptionsJSON)) : {
        palette: palettes[0],
      }

      if (options.name) fxOptions!.name = options.name
      if (options.palette) fxOptions.palette = options.palette
      if (options.mode && fxOptions.palette) fxOptions.palette.mode = options.mode
      else fxOptions!.palette!.mode = theme.palette.mode
    }

    setTheme(createFxTheme(fxOptions))
    localStorage.setItem("themeOptions", JSON.stringify(fxOptions))
  }

  useEffect( () => {
    const themeOptions = localStorage.getItem("themeOptions")
    setTheme(createFxTheme(themeOptions ? (JSON.parse(themeOptions)) : appThemes[0]))
  }, [])

    const router = useRouter();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const handleStart = (url: any) => (url !== router.asPath) && setLoading(true);
      const handleComplete = (url: any) => (url === router.asPath) && setLoading(false);

      router.events.on('routeChangeStart', handleStart)
      router.events.on('routeChangeComplete', handleComplete)
      router.events.on('routeChangeError', handleComplete)

      return () => {
        router.events.off('routeChangeStart', handleStart)
        router.events.off('routeChangeComplete', handleComplete)
        router.events.off('routeChangeError', handleComplete)
      }
    })
  



  return(
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ConfirmProvider>
          <SnackbarProvider maxSnack={3} anchorOrigin={{horizontal: "right", vertical: "bottom"}}
            hideIconVariant={ true } >
            <AppBar position={'sticky'} sx={{boxShadow: 0}}>
              <Toolbar >
                <Link href={"/"} style={{textDecoration: "none"}} >
                  <Image src="/images/strategy-fx-logo.png" alt="logo" width="125" height="25"
                    style={{position: 'relative', top: '5px'}}/>

                </Link>
                <Box sx={{pl: 2, display: 'flex', position: 'relative', top: '3px'}}>
                  { appMenuItems.map( (i: AppBarMenuProps) => (
                    <AppBarMenu key={i.id} title={i.title} id={i.id} boards={i.boards}
                      icon={i.icon} />
                  )) }
                </ Box>
                <Box sx={{flexGrow: 1}} />
                <AuthNav setAuthDialogIsOpen={setAuthDialogIsOpen} />
                <IconButton size="large" edge="end" aria-label="app settings" aria-haspopup="true"
                  color="inherit" onClick={ () => setSettingsDialogIsOpen(true)} >
                  <SettingsIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
           {
            loading ? <Loading /> :  <Component {...pageProps} openAuthDialog={ () => setAuthDialogIsOpen(true)} />
           }
           
           
            <SettingsDialog updateFx={handleUpdateTheme} dialogIsOpen={settingsDialogIsOpen}
              closeDialog={ () => setSettingsDialogIsOpen(false)} />
            <AuthDialog dialogIsOpen={authDialogIsOpen}
              closeDialog={ () => setAuthDialogIsOpen(false)}
              openRegDialog={ () => setRegDialogIsOpen(true)}
              openForgotDialog={ () => setForgotDialogIsOpen(true)} />
            <RegisterDialog dialogIsOpen={regDialogIsOpen}
              closeDialog={ () => setRegDialogIsOpen(false)}
              openAuthDialog={ () => setAuthDialogIsOpen(true)} />
            <ForgotPasswordDialog dialogIsOpen={forgotDialogIsOpen}
              closeDialog={ () => setForgotDialogIsOpen(false)} />
          </SnackbarProvider>
        </ConfirmProvider>
      </ ThemeProvider>
    </SessionProvider>
  )
}
// QA: Brian Francis 08-23-23