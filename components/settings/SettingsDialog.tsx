import React from 'react'
import { Box, Button,  DialogActions, DialogContent, useTheme, Typography, ToggleButtonGroup, ToggleButton, Stack } from '@mui/material'

import DraggableDialog from '../../ui/DraggableDialog'
import SettingsPalettes from './SettingsPalettes'

import {  VariantType, useSnackbar } from 'notistack';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';


export default function SettingsDialog(props: any) {
  const { dialogIsOpen, updateFx, closeDialog } = props

  const theme = useTheme()

  const { enqueueSnackbar } = useSnackbar()

  const handleUpdateMode= (mode: any) => {
    const variant: VariantType = 'info'
    enqueueSnackbar(`${mode} Mode`, {variant});
    updateFx({mode: mode.toLowerCase()})
  }

  return (
    <DraggableDialog
      dialogIsOpen={dialogIsOpen}
      ariaLabel='app-settings'
      title='SETTINGS'
    >
      <DialogContent sx={{width: '100%'}}>
      <Stack direction={'column'} spacing={3}>      
        <Box>
          <Typography>Mode:</Typography>   
          <ToggleButtonGroup  size='small' value={theme.palette.mode}>
            <ToggleButton value='light'> <LightModeIcon onClick={() => handleUpdateMode('Light')} /></ToggleButton>
            <ToggleButton value='dark'> <DarkModeIcon onClick={() => handleUpdateMode('Dark')} /></ToggleButton>
          </ToggleButtonGroup>
        </Box>       
        <SettingsPalettes updateTheme={updateFx} width='400px' />
      </Stack>
      </DialogContent>
      <DialogActions disableSpacing={false}>
        <Button onClick={closeDialog} color={'info'} variant='outlined'> Done </Button>
      </DialogActions>
    </DraggableDialog>
  )
}