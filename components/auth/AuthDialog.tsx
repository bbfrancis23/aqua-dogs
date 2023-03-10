
import React from 'react'
import DraggableDialog from '../../ui/DraggableDialog'
import AuthForm from './AuthForm'

interface AuthDialogProps {
  dialogIsOpen: boolean;
  closeDialog: () => void;
  openRegDialog: () => void;
}

export default function AuthDialog(props: AuthDialogProps) {
  const { dialogIsOpen, closeDialog,  openRegDialog } = props

  return (
    <DraggableDialog
      dialogIsOpen={dialogIsOpen}
      ariaLabel="auth-dialog"
      title="LOGIN"
    >
      <AuthForm
        openRegisterDialog={openRegDialog}
        closeDialog={closeDialog}
      />
    </DraggableDialog>
  )
}