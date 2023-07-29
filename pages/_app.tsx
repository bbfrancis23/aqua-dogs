import {useState, useEffect} from "react"

import type {AppProps} from "next/app"
import Link from "next/link"
import {SessionProvider} from "next-auth/react"

import { CssBaseline, ThemeProvider, AppBar, Toolbar, Typography, Box, IconButton}
  from "@mui/material"
import {ConfirmProvider} from "material-ui-confirm"
import SettingsIcon from "@mui/icons-material/Settings"
import {SnackbarProvider} from "notistack"

import {appThemes, palettes, createFxTheme} from "../theme/themes"
import AuthNav from "@/components/auth/AuthNav"
import AppBarMenu, {AppBarMenuProps} from "@/components/AppBarMenu"
import SettingsDialog from "@/components/settings/SettingsDialog"
import RegisterDialog from "@/components/auth/dialogs/RegisterDialog"
import ForgotPasswordDialog from "@/components/auth/dialogs/ForgotPasswordDialog"
import AuthDialog from "@/components/auth/dialogs/AuthDialog"
import {appMenuItems} from "../data/appMenuItems"
import '../styles/globals.css'


export default function App({Component, pageProps: {session, ...pageProps},}: AppProps) {

  const [settingsDialogIsOpen, setSettingsDialogIsOpen] = useState(false)
  const [authDialogIsOpen, setAuthDialogIsOpen] = useState(false)
  const [regDialogIsOpen, setRegDialogIsOpen] = useState(false)
  const [forgotDialogIsOpen, setForgotDialogIsOpen] = useState(false)

  const [theme, setTheme] = useState(createFxTheme( appThemes[0]))

  const handleUpdateTheme = (options: any) => {
    let fxOptions:any = {}

    if (options) {
      fxOptions = localStorage.getItem("themeOptions")

      fxOptions = fxOptions ? (JSON.parse(fxOptions)) : {
        palette: palettes[0],
      }

      if (options.name) fxOptions.name = options.name
      if (options.palette) fxOptions.palette = options.palette
      if (options.mode) fxOptions.palette.mode = options.mode
      else fxOptions.palette.mode = theme.palette.mode
    }

    setTheme(createFxTheme(fxOptions))
    localStorage.setItem("themeOptions", JSON.stringify(fxOptions))
  }

  useEffect( () => {
    const themeOptions = localStorage.getItem("themeOptions")
    setTheme(createFxTheme(themeOptions ? (JSON.parse(themeOptions)) : appThemes[0]))
  }, [])

  return(
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ConfirmProvider>
          <SnackbarProvider maxSnack={3} anchorOrigin={{horizontal: "right", vertical: "bottom"}}
            hideIconVariant={ true } >
            <AppBar position="static" sx={{boxShadow: 0}}>
              <Toolbar >
                <Link href={"/"} style={{textDecoration: "none"}} >
                  <Typography variant="h6" noWrap component="div"
                    sx={{ color: theme.palette.mode === 'light' ?
                      "primary.contrastText" : "primary.light", fontWeight: '800' }}
                  >
                  Your Moms STRATEGY INC.
                  </Typography>
                </Link>
                <Box sx={{pl: 2, display: 'flex', position: 'relative', top: '3px'}}>
                  { appMenuItems.map( (i: AppBarMenuProps) => (
                    <AppBarMenu key={i.id} title={i.title} id={i.id} items={i.items}
                      icon={i.icon} />
                  ))
                  }
                </ Box>

                <Box sx={{flexGrow: 1}} />
                <AuthNav setAuthDialogIsOpen={setAuthDialogIsOpen} />
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="app settings"
                  aria-haspopup="true"
                  color="inherit"
                  onClick={ () => setSettingsDialogIsOpen(true)}
                >
                  <SettingsIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
            <Component {...pageProps} openAuthDialog={ () => setAuthDialogIsOpen(true)} />
            <SettingsDialog
              updateFx={handleUpdateTheme}
              dialogIsOpen={settingsDialogIsOpen}
              closeDialog={ () => setSettingsDialogIsOpen(false)}
            />
            <AuthDialog
              dialogIsOpen={authDialogIsOpen}
              closeDialog={ () => setAuthDialogIsOpen(false)}
              openRegDialog={ () => setRegDialogIsOpen(true)}
              openForgotDialog={ () => setForgotDialogIsOpen(true)}
            />
            <RegisterDialog
              dialogIsOpen={regDialogIsOpen}
              closeDialog={ () => setRegDialogIsOpen(false)}
              openAuthDialog={ () => setAuthDialogIsOpen(true)}
            />
            <ForgotPasswordDialog
              dialogIsOpen={forgotDialogIsOpen}
              closeDialog={ () => setForgotDialogIsOpen(false)}
            />
          </SnackbarProvider>
        </ConfirmProvider>
      </ ThemeProvider>
    </SessionProvider>
  )
}

// QA done