import React, { useContext } from "react"

import {useTheme, Stack, Box, Theme} from "@mui/material"
import StarIcon from "@mui/icons-material/Star"
import Fab from "@mui/material/Fab"
import { useSnackbar} from "notistack"

// import { palettes} from "../../theme/themes"
import { FxTheme, FxThemeContext, createFxTheme, fxThemeOptionsList,
  UpdateThemeOptionsProps } from "fx-theme"
//import { FxTheme } from "theme/globalTheme"


type SettingsPalettesProps = {
  updateFx: (options: UpdateThemeOptionsProps) => void
}

const SettingsPalettes = ( props: SettingsPalettesProps) => {

  const theme: Theme = useTheme()

  const {fxTheme} = useContext(FxThemeContext)

  const {updateFx} = props
  const paletteCols = 4

  const {enqueueSnackbar} = useSnackbar()

  const handleUpdateTheme = (index: number) => {
    enqueueSnackbar(`${fxThemeOptionsList[index].name} Theme`,
      {})
    updateFx({name: fxThemeOptionsList[index].name})
  }


  const getPaletteButton = (index: number) => (
    <Fab onClick={() => handleUpdateTheme(index)}
      key={index} sx={{
        background:
          `linear-gradient( 
            -25deg, 
            ${fxThemeOptionsList[index].palette.secondary[100]} -50%, 
            ${fxThemeOptionsList[index].palette.primary[800]} 100% )`,
        ":hover":
        { background:
            `linear-gradient( 
              -25deg, 
              ${fxThemeOptionsList[index].palette.secondary[100]} -5%, 
              ${fxThemeOptionsList[index].palette.primary[800]} 100% )`, },
        m: 1,
      }}
      style={{color: theme.palette.getContrastText('#000000')}}
    >
      <StarIcon
        style={{visibility: fxTheme.name === fxThemeOptionsList[index].name ? "visible"
          : "hidden"}} />
    </Fab>
  )

  return (
    <Box >
      <span>Palette:</span>
      <Stack direction={"row"}>
        { fxThemeOptionsList.slice(0, paletteCols).map((t, index) => getPaletteButton(index)) }
      </Stack>
      <Stack direction={"row"} >
        { fxThemeOptionsList.slice(paletteCols, paletteCols + paletteCols)
          .map((t, index) => getPaletteButton((index + paletteCols))) }
      </Stack>
    </ Box>

  )
}
export default SettingsPalettes

// QA done 8-3-23