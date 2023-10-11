import { CssBaseline, PaletteMode, ThemeProvider } from "@mui/material"
import { FxTheme, FxThemeContext, FxThemeNames, UpdateThemeOptionsProps,
  createFxTheme, defaultFxTheme, fxThemeOptionsList } from "fx-theme"
import { ConfirmProvider } from "material-ui-confirm"
import { SnackbarOrigin, SnackbarProvider } from "notistack"
import { useEffect, useReducer, useState } from "react"

export interface AppCompoentProps {
  children: JSX.Element | JSX.Element []
}


export const AppComponent = ({children}:AppCompoentProps) => {

  const [fxTheme, setFxTheme] = useState<FxTheme>(defaultFxTheme)

  // TODO: This could be more modular and could be put into FxTheme
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
    handleUpdateTheme({})
  }, [])

  const snackbarPos: SnackbarOrigin = {horizontal: "right", vertical: "bottom"}

  return (

    <FxThemeContext.Provider value={{fxTheme, setFxTheme}}>
      <ThemeProvider theme={fxTheme.theme}>
        <ConfirmProvider>
          <SnackbarProvider maxSnack={3} hideIconVariant={true} anchorOrigin={snackbarPos} >
            <CssBaseline />
            { children}
          </SnackbarProvider>
        </ConfirmProvider>
      </ThemeProvider>
    </FxThemeContext.Provider>
  )
}

export default AppComponent
/* QA: Brian Francis 10-10-23 - 3 stars
    - Update theme could be better and put into FxTheme - low priority */