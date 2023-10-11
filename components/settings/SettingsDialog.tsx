import React, { useContext } from "react"
import { Box, Button, DialogActions, DialogContent, useTheme, Typography,
  ToggleButtonGroup, ToggleButton, Stack, PaletteMode} from "@mui/material"
import {VariantType, useSnackbar} from "notistack"
import DarkModeIcon from "@mui/icons-material/DarkMode"
import LightModeIcon from "@mui/icons-material/LightMode"

import SettingsPalettes from "./SettingsPalettes"
import DraggableDialog from "@/ui/DraggableDialog"
import { FxThemeContext, FxThemeOptions, UpdateThemeOptionsProps,
  createFxTheme, fxThemeOptionsList } from "fx-theme"
import { DialogActions as AppDialogActions, AppDialogs } from "@/react/app/app-types"
import { AppContext } from "@/react/app"


export default function SettingsDialog() {
  const theme = useTheme()

  const {enqueueSnackbar} = useSnackbar()

  const {app, dialogActions} = useContext(AppContext)

  const { setFxTheme} = useContext(FxThemeContext)

  const handleUpdateMode = (mode: 'Light' | 'Dark') => {

    let fxThemeOptions: FxThemeOptions| undefined = undefined
    setFxTheme((prev) => {
      fxThemeOptions = fxThemeOptionsList.find((i) => i.name === prev.name)
      if (!fxThemeOptions) return prev
      fxThemeOptions.palette.mode = mode.toLowerCase() as PaletteMode
      localStorage.setItem('themeMode', mode.toLowerCase())
      return createFxTheme(fxThemeOptions)
    })
    enqueueSnackbar(`${mode} Mode` )
  }

  const handleCloseDialog = () => {
    dialogActions({type: AppDialogActions.Close, dialog: AppDialogs.Settings})
  }

  return (
    <DraggableDialog
      dialogIsOpen={app.settingsDialogIsOpen} ariaLabel="app-settings" title="SETTINGS" >
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
          <SettingsPalettes />
        </Stack>
      </DialogContent>
      <DialogActions disableSpacing={false}>
        <Button color="inherit" variant="outlined"
          onClick={ handleCloseDialog} >
          Done
        </Button>
      </DialogActions>
    </DraggableDialog>
  )
}

// QA done 8-3-23