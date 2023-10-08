import {useState, useEffect, useMemo, useReducer} from "react"

import type {AppProps} from "next/app"
import Link from "next/link"
import Image from "next/image"
import {SessionProvider} from "next-auth/react"

import { CssBaseline, ThemeProvider, AppBar, Toolbar, Box, alpha,
  IconButton,
  Theme} from "@mui/material"
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


/********* Interfaces Global and Helpers ********/

export interface UpdateThemeOptionsProps {
  palette: FxPaletteOptions
  name?: string
  mode?: string
}


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


  const [theme, setTheme] = useState<Theme>(createFxTheme(appThemes[0]))
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
      else fxOptions!.palette!.mode = theme?.palette.mode
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
    router.events.on('routeChangeStart', () => setLoading(true))
    router.events.on('routeChangeComplete', () => setLoading(false))
    router.events.on('routeChangeError', () => setLoading(false))
  }, [router])


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
                <AuthNav

                  setAuthDialogIsOpen={(payload) =>
                    dispatch({type: AppActions.SetAuthDialogIsOpen, payload}) } />


                <IconButton size="large" edge="end" aria-label="app settings" aria-haspopup="true"
                  color="inherit"
                  onClick={ () =>
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

            <SettingsDialog updateFx={handleUpdateTheme} dialogIsOpen={state.settingsDialogIsOpen}
              closeDialog={
                () =>
                  dispatch({type: AppActions.SetSettingsDialogIsOpen, payload: false}) }/>
            <AuthDialog dialogIsOpen={state.authDialogIsOpen}
              closeDialog={() => dispatch({ type: AppActions.SetAuthDialogIsOpen, payload: false}) }
              openRegDialog={
                () => dispatch({ type: AppActions.SetRegDialogIsOpen, payload: true}) }
              openForgotDialog={
                () => dispatch({type: AppActions.SetForgotDialogIsOpen, payload: true})} />
            <RegisterDialog dialogIsOpen={state.regDialogIsOpen}
              closeDialog={ () => dispatch({ type: AppActions.SetRegDialogIsOpen, payload: false})}
              openAuthDialog={
                () => dispatch({ type: AppActions.SetAuthDialogIsOpen, payload: true})} />
            <ForgotPasswordDialog dialogIsOpen={state.forgotDialogIsOpen}
              closeDialog={
                () => dispatch({type: AppActions.SetForgotDialogIsOpen, payload: false}) } />
          </SnackbarProvider>
        </ConfirmProvider>
      </ ThemeProvider>
    </SessionProvider>
  )
}

export default App
// QA: Brian Francis 08-23-23