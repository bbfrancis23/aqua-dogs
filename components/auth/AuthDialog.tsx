
import React from 'react'
import DraggableDialog from '../../ui/DraggableDialog'
import LoginForm from './AuthForm'

export default function RegisterDialog(props:any) {
  const { dialogIsOpen, closeDialog, loginUser, openRegisterDialog } = props

  return (
    <DraggableDialog
      dialogIsOpen={dialogIsOpen}
      ariaLabel="auth-dialog"
      title="LOGIN"
    >
      <LoginForm
        openRegisterDialog={openRegisterDialog}
        closeDialog={closeDialog}
      />
    </DraggableDialog>
  )
}