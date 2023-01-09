import React from 'react'
import { Button, DialogActions, DialogContent } from '@mui/material'
import RegisterForm from './RegisterForm'

import DraggableDialog from '../../ui/DraggableDialog'

export default function RegisterDialog(props: any) {
  const { dialogIsOpen,  closeDialog } = props



  return (
    <DraggableDialog
      dialogIsOpen={dialogIsOpen}
      ariaLabel="Register Dialog"
      title="REGISTER"
    >
      <DialogContent sx={{width: '100%'}}>
        <RegisterForm closeDialog={closeDialog} />
      </DialogContent>
      <DialogActions disableSpacing={false}>
        <Button onClick={closeDialog}> CANCEL </Button>
      </DialogActions>
    </DraggableDialog>
  )
}