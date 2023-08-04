import React from "react"
import { Box, Button, DialogActions, DialogContent, useTheme, Typography,
  ToggleButtonGroup, ToggleButton, Stack} from "@mui/material"
import {VariantType, useSnackbar} from "notistack"
import DarkModeIcon from "@mui/icons-material/DarkMode"
import LightModeIcon from "@mui/icons-material/LightMode"

import SettingsPalettes from "./SettingsPalettes"
import { UpdateThemeOptionsProps } from "pages/_app"
import DraggableDialog from "@/ui/DraggableDialog"


export interface SettingsDialogProps {
  dialogIsOpen: boolean
  updateFx: (theme: UpdateThemeOptionsProps) => void
  closeDialog: () => void
}

export default function SettingsDialog(props: any) {
  const {dialogIsOpen, updateFx, closeDialog} = props

  const theme = useTheme()

  const {enqueueSnackbar} = useSnackbar()

  const handleUpdateMode = (mode: any) => {
    const variant: VariantType = "info"
    enqueueSnackbar(`${mode} Mode`, {variant})
    updateFx({mode: mode.toLowerCase()})
  }

  return (
    <DraggableDialog dialogIsOpen={dialogIsOpen} ariaLabel="app-settings" title="SETTINGS" >
      <DialogContent sx={{width: "100%"}}>
        <Stack direction={"column"} spacing={3}>
          <Box>
            <Typography>Mode:</Typography>
            <ToggleButtonGroup size="small" value={theme.palette.mode}>
              <ToggleButton value="light">
                <LightModeIcon onClick={() => handleUpdateMode("Light")} />
              </ToggleButton>
              <ToggleButton value="dark">
                <DarkModeIcon onClick={() => handleUpdateMode("Dark")} />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <SettingsPalettes updateFx={updateFx} />
        </Stack>
      </DialogContent>
      <DialogActions disableSpacing={false}>
        <Button onClick={closeDialog} color={"info"} variant="outlined"> Done </Button>
      </DialogActions>
    </DraggableDialog>
  )
}

// QA done 8-3-23