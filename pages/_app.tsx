import {useState, useEffect, useMemo, useReducer, Dispatch, SetStateAction} from "react"

import type {AppProps} from "next/app"
import Link from "next/link"
import Image from "next/image"
import {SessionProvider} from "next-auth/react"

import { CssBaseline, ThemeProvider, AppBar,
  Toolbar, Box, IconButton, PaletteMode, } from "@mui/material"
import {ConfirmProvider} from "material-ui-confirm"
import SettingsIcon from "@mui/icons-material/Settings"
import {SnackbarProvider} from "notistack"

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
import { FxTheme, FxThemeContext, FxThemeNames,
  UpdateThemeOptionsProps, createFxTheme, defaultFxTheme, fxThemeOptionsList,} from "fx-theme"


/********* Interfaces Global and Helpers ********/


enum AppActions {
  SetSettingsDialogIsOpen = "SetSettingsDialogIsOpen",
  SetAuthDialogIsOpen = "SetAuthDialogIsOpen",
  SetRegDialogIsOpen = "SetRegDialogIsOpen",
  SetForgotDialogIsOpen = "SetForgotDialogIsOpen",
}

export interface AppState{
  settingsDialogIsOpen: boolean,
  authDialogIsOpen: boolean,
  regDialogIsOpen: boolean,
  forgotDialogIsOpen: boolean,
}
export interface AppAction{
  type: AppActions,
  payload: boolean
}

export const reducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
  case AppActions.SetSettingsDialogIsOpen:
    return { ...state, settingsDialogIsOpen: action.payload }
  case AppActions.SetAuthDialogIsOpen:
    return { ...state, authDialogIsOpen: action.payload }
  case AppActions.SetRegDialogIsOpen:
    return { ...state, regDialogIsOpen: action.payload }
  case AppActions.SetForgotDialogIsOpen:
    return { ...state, forgotDialogIsOpen: action.payload }
  default:
    return state
  }
}

/********* FrontEnd  **********/

const App = ({Component, pageProps: {session, ...pageProps},}: AppProps) => {

  const [state, dispatch] = useReducer(reducer,
    {settingsDialogIsOpen: false, authDialogIsOpen: false, regDialogIsOpen: false,
      forgotDialogIsOpen: false})

  const [fxTheme, setFxTheme] = useState<FxTheme>(defaultFxTheme)

  const handleUpdateTheme = (
    options: UpdateThemeOptionsProps,
  ) => {
    let themeName =
      localStorage.getItem('themeName') !== null ?
        localStorage.getItem('themeName') : FxThemeNames.Ocean
    let themeMode = localStorage.getItem('themeMode') ? localStorage.getItem('themeMode') : 'light'

    if (options.name) themeName = options.name
    if (options.mode) themeMode = options.mode

    if (!themeName) return
    if (!themeMode) return

    if (themeMode !== 'light' && themeMode !== 'dark') themeMode = 'light'
    themeName = Object.keys(FxThemeNames).some((tn) => tn === themeName)
      ? themeName
      : FxThemeNames.Ocean

    const fxThemeOptions = fxThemeOptionsList.find((i) => i.name === themeName)
    if (!fxThemeOptions) return

    if (themeMode) fxThemeOptions!.palette.mode = themeMode as PaletteMode

    setFxTheme(createFxTheme(fxThemeOptions))

    localStorage.setItem('themeName', themeName)
    localStorage.setItem('themeMode', themeMode)
  }

  useEffect( () => {
    console.log("useEffect triggered")
    handleUpdateTheme({})
  }, [])

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    router.events.on('routeChangeStart', () => setLoading(true))
    router.events.on('routeChangeComplete', () => setLoading(false))
    router.events.on('routeChangeError', () => setLoading(false))
  }, [router])


  return(
    <FxThemeContext.Provider value={{fxTheme, setFxTheme}}>
      <SessionProvider session={session} refetchInterval={5 * 60}>
        <ThemeProvider theme={fxTheme.theme}>
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
                        icon={i.icon} /> )) }
                  </ Box>
                  <Box sx={{flexGrow: 1}} />
                  <AuthNav
                    setAuthDialogIsOpen={(payload) =>
                      dispatch({type: AppActions.SetAuthDialogIsOpen, payload}) } />
                  <IconButton size="large" edge="end" aria-label="app settings" aria-haspopup="true"
                    color="inherit" onClick={ () =>
                      dispatch({type: AppActions.SetSettingsDialogIsOpen, payload: true})} >
                    <SettingsIcon />
                  </IconButton>
                </Toolbar> {
                  loading ? <Loading /> : <></>
                }
              </AppBar>
              <Box>
                <Component {...pageProps} openAuthDialog={
                  () => dispatch({type: AppActions.SetAuthDialogIsOpen, payload: true}) } />


              </Box>

              <SettingsDialog
                updateFx={handleUpdateTheme} dialogIsOpen={state.settingsDialogIsOpen}
                closeDialog={ () =>
                  dispatch({type: AppActions.SetSettingsDialogIsOpen, payload: false}) }/>
              <AuthDialog dialogIsOpen={state.authDialogIsOpen}
                closeDialog={
                  () => dispatch({ type: AppActions.SetAuthDialogIsOpen, payload: false}) }
                openRegDialog={
                  () => dispatch({ type: AppActions.SetRegDialogIsOpen, payload: true}) }
                openForgotDialog={
                  () => dispatch({type: AppActions.SetForgotDialogIsOpen, payload: true})} />
              <RegisterDialog dialogIsOpen={state.regDialogIsOpen}
                closeDialog={
                  () => dispatch({ type: AppActions.SetRegDialogIsOpen, payload: false})}
                openAuthDialog={
                  () => dispatch({ type: AppActions.SetAuthDialogIsOpen, payload: true})} />
              <ForgotPasswordDialog dialogIsOpen={state.forgotDialogIsOpen}
                closeDialog={
                  () => dispatch({type: AppActions.SetForgotDialogIsOpen, payload: false}) } />
            </SnackbarProvider>
          </ConfirmProvider>
        </ ThemeProvider>
      </SessionProvider>
    </FxThemeContext.Provider>
  )
}

export default App
// QA: Brian Francis 08-23-23