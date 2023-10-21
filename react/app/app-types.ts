import {Dispatch} from 'react'
export enum DialogActions {
  Open = 'Open',
  Close = 'Close',
}

export enum AppDialogs {
  Settings = 'Settings',
  Auth = 'Auth',
  Reg = 'Reg',
  Forgot = 'Forgot',
  All = 'All',
}

export interface AppState {
  settingsDialogIsOpen: boolean
  authDialogIsOpen: boolean
  regDialogIsOpen: boolean
  forgotDialogIsOpen: boolean
}
export interface DialogAction {
  type: DialogActions
  dialog: AppDialogs
}

export interface AppContextProps {
  app: AppState
  dialogActions: Dispatch<DialogAction>
}

// QA: Brian Francis 10-20-23
