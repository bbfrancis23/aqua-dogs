import React from "react"

import {useTheme, Stack, Box} from "@mui/material"
import StarIcon from "@mui/icons-material/Star"
import Fab from "@mui/material/Fab"
import { useSnackbar} from "notistack"

import { palettes} from "../../theme/themes"
import { FxTheme } from "theme/globalTheme"

import { UpdateThemeOptionsProps } from "pages/_app"

type SettingsPalettesProps = {
  updateFx: (theme: UpdateThemeOptionsProps) => void
}

const SettingsPalettes = ( props: SettingsPalettesProps) => {

  const theme: FxTheme = useTheme()

  const {updateFx} = props
  const paletteCols = 4

  const {enqueueSnackbar} = useSnackbar()

  const handleUpdateTheme = (index: number) => {
    enqueueSnackbar(`${palettes[index].name} Theme`, {variant: "info"})
    updateFx({palette: palettes[index]})
  }

  const getPaletteButton = (index: number) => (
    <Fab onClick={() => handleUpdateTheme(index)}
      key={index} sx={{
        background:
          `linear-gradient( 
            -25deg, 
            ${palettes[index].secondary.main} -50%, 
            ${palettes[index]?.primary?.main} 100% )`,
        ":hover":
        { background:
            `linear-gradient( 
              -25deg, 
              ${palettes[index].secondary.main} -5%, 
              ${palettes[index].primary.main} 100% )`, },
        m: 1,
      }}
      style={{color: theme.palette.getContrastText(palettes[index].primary.main)}}
    >
      <StarIcon
        style={{visibility: theme.palette.name === palettes[index].name ? "visible" : "hidden"}} />
    </Fab>
  )

  return (
    <Box >
      <span>Palette:</span>
      <Stack direction={"row"}>
        { palettes.slice(0, paletteCols).map((t, index) => getPaletteButton(index)) }
      </Stack>
      <Stack direction={"row"} >
        { palettes.slice(paletteCols, paletteCols + paletteCols)
          .map((t, index) => getPaletteButton((index + paletteCols))) }
      </Stack>
    </ Box>

  )
}
export default SettingsPalettes

// QA done 8-3-23