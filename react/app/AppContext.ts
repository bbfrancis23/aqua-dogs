/* eslint-disable indent */

import {createContext, useReducer} from 'react'
import {AppContextProps, AppDialogs, AppState, DialogAction, DialogActions} from '../app'

export const appReducer = (app: AppState, action: DialogAction): AppState => {
  if (!action) return app
  if (action.type === DialogActions.Open) {
    switch (action.dialog) {
      case AppDialogs.Settings:
        return {...app, settingsDialogIsOpen: true}
      case AppDialogs.Auth:
        return {...app, authDialogIsOpen: true}
      case AppDialogs.Reg:
        return {...app, regDialogIsOpen: true}
      case AppDialogs.Forgot:
        return {...app, forgotDialogIsOpen: true}
      default:
        return app
    }
  }

  if (action.type === DialogActions.Close) {
    switch (action.dialog) {
      case AppDialogs.Settings:
        return {...app, settingsDialogIsOpen: false}
      case AppDialogs.Auth:
        return {...app, authDialogIsOpen: false}
      case AppDialogs.Reg:
        return {...app, regDialogIsOpen: false}
      case AppDialogs.Forgot:
        return {...app, forgotDialogIsOpen: false}
      case AppDialogs.All:
        return {
          ...app,
          settingsDialogIsOpen: false,
          authDialogIsOpen: false,
          regDialogIsOpen: false,
          forgotDialogIsOpen: false,
        }
      default:
        return app
    }
  }
  return app
}

export const AppContext = createContext<AppContextProps>({} as AppContextProps)
