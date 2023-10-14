import '../styles/globals.css'
import {useState, useEffect, useReducer} from "react"

import type {AppProps} from "next/app"
import Link from "next/link"
import { useRouter } from "next/router"
import {SessionProvider} from "next-auth/react"
import Loading from "./Loading"

import { AppBar, Toolbar, Box, IconButton, IconButtonProps } from "@mui/material"
import SettingsIcon from "@mui/icons-material/Settings"

import LogoImage from '@/react/LogoImage'
import { AppContext, AppDialogs, DialogActions, appReducer, AppBarMenuItems } from '@/react/app'

import { AuthDialog, AuthNav, RegisterDialog, ForgotPasswordDialog } from '@/react/auth'
import { SettingsDialog } from '@/react/settings'

import App from "./App"

const FiveMinutes = 5 * 60;

const NextApp = ({Component, pageProps: {session, ...pageProps},}: AppProps) => {

  // init app state
  const [app, dialogActions] = useReducer(appReducer,
    {settingsDialogIsOpen: false, authDialogIsOpen: false,
      regDialogIsOpen: false, forgotDialogIsOpen: false})

  // TODO: Make this a hook for readability - low priority
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  useEffect(() => {
    router.events.on('routeChangeStart', () => setLoading(true))
    router.events.on('routeChangeComplete', () => setLoading(false))
    router.events.on('routeChangeError', () => setLoading(false))
  }, [router])

  const iconButton: IconButtonProps = {
    size: "large",
    edge: "end",
    "aria-label": "app settings",
    "aria-haspopup": true,
    color: "inherit",
    onClick: () => dialogActions({type: DialogActions.Open, dialog: AppDialogs.Settings}),
  }

  return(
    <App>
      <AppContext.Provider value={{app, dialogActions}}>
        <SessionProvider session={session} refetchInterval={FiveMinutes}>
          <AppBar position={'sticky'}>
            <Toolbar >
              <Link href={"/"} style={{textDecoration: "none"}} ><LogoImage /></Link>
              <AppBarMenuItems />
              <Box sx={{flexGrow: 1}} />
              <AuthNav />
              <IconButton {...iconButton}><SettingsIcon /></IconButton>
            </Toolbar> { loading ? <Loading /> : <></> }
          </AppBar>
          <Box><Component {...pageProps} /></Box>
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
// QA: Brian Francis 10-10-23 - 4 stars - rounter loading hook for readability