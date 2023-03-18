import React from 'react'
import { Button, DialogActions, DialogContent } from '@mui/material'
import RegisterForm from './RegisterForm'

import DraggableDialog from '../DraggableDialog'

interface RegDialogProps {
  dialogIsOpen: boolean;
  closeDialog: () => void;
  openAuthDialog: () => void;
}

export default function RegisterDialog(props: RegDialogProps) {
  const { dialogIsOpen, closeDialog, openAuthDialog} = props

  return (
    <DraggableDialog
      dialogIsOpen={dialogIsOpen}
      ariaLabel="register-dialog"
      title="REGISTER"
    > 
      <RegisterForm closeDialog={closeDialog} openAuthDialog={openAuthDialog}/>    
    </DraggableDialog>
  )
}