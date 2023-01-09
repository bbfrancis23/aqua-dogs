import React from 'react'
import { Button, DialogActions, DialogContent } from '@mui/material'

import DraggableDialog from '../../ui/DraggableDialog'
import SettingsPalettes from './SettingsPalettes'

export default function SettingsDialog(props: any) {
  const { dialogIsOpen, updateFx, closeDialog } = props



  return (
    <DraggableDialog
      dialogIsOpen={dialogIsOpen}
      ariaLabel="App Settings"
      title="SETTINGS"
    >
      <DialogContent sx={{width: '100%'}}>
        <SettingsPalettes updateFx={updateFx} width='400px' />
      </DialogContent>
      <DialogActions disableSpacing={false}>
        <Button onClick={closeDialog}> Done </Button>
        <Button onClick={closeDialog} variant="outlined">  More      </Button>
      </DialogActions>
    </DraggableDialog>
  )
}