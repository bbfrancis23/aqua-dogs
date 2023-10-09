import '../styles/globals.css'
import {useState, useEffect, useReducer, useContext} from "react"

import type {AppProps} from "next/app"
import Link from "next/link"
import Image from "next/image"
import {SessionProvider} from "next-auth/react"
import { useRouter } from "next/router"

import { AppBar, Toolbar, Box, IconButton } from "@mui/material"
import SettingsIcon from "@mui/icons-material/Settings"
import Loading from "./Loading"

import AuthNav from "@/components/auth/AuthNav"
import SettingsDialog from "@/components/settings/SettingsDialog"
import RegisterDialog from "@/components/auth/dialogs/RegisterDialog"
import AuthDialog from "@/components/auth/dialogs/AuthDialog"
import ForgotPasswordDialog from "@/components/auth/dialogs/ForgotPasswordDialog"


import { DialogActions, AppContext, AppDialogs, appReducer } from "@/react/app/App"
import {appMenuItems} from "@/react/app/data/appMenuItems"
import AppBarMenu, {AppBarMenuProps} from "@/react/app/components/AppBarMenu"
import App from "./App"
import { FxThemeContext } from 'fx-theme'
import { set } from 'mongoose'

const NextApp = ({Component, pageProps: {session, ...pageProps},}: AppProps) => {

  const [app, dialogActions] = useReducer(appReducer,
    {settingsDialogIsOpen: false, authDialogIsOpen: false, regDialogIsOpen: false,
      forgotDialogIsOpen: false})


  const router = useRouter()


  const [loading, setLoading] = useState(false);

  useEffect(() => {
    router.events.on('routeChangeStart', () => setLoading(true))
    router.events.on('routeChangeComplete', () => setLoading(false))
    router.events.on('routeChangeError', () => setLoading(false))
  }, [router])

  const handleOpenSettingsDialog = () => {
    dialogActions({type: DialogActions.Open, dialog: AppDialogs.Settings})
  }

  return(
    <App>
      <AppContext.Provider value={{app, dialogActions}}>
        <SessionProvider session={session} refetchInterval={5 * 60}>
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
              <AuthNav />
              <IconButton size="large" edge="end" aria-label="app settings" aria-haspopup="true"
                color="inherit" onClick={ handleOpenSettingsDialog} >
                <SettingsIcon />
              </IconButton>
            </Toolbar> {
              loading ? <Loading /> : <></>
            }
          </AppBar>
          <Box>
            <Component {...pageProps} />
          </Box>
          <SettingsDialog />
          <AuthDialog />
          <RegisterDialog />
          <ForgotPasswordDialog />

        </SessionProvider>
      </AppContext.Provider>
    </App>
  )
}

export default NextApp
// QA: Brian Francis 08-23-23