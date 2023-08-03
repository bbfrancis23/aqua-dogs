import React from "react"
import {useTheme, Stack} from "@mui/material"
import Box from "@mui/material/Box"
import StarIcon from "@mui/icons-material/Star"
import Fab from "@mui/material/Fab"
import {palettes} from "../../theme/themes"

import { useSnackbar} from "notistack"
import exp from "constants"

type SettingsPalettesProps = {
  updateTheme: (theme: any) => void
}

const SettingsPalettes = ( props: SettingsPalettesProps) => {

  const theme = useTheme()
  const {palette} = theme
  const fxPalette: any = {...palette}
  const {updateTheme} = props
  const paletteCols = 4

  const {enqueueSnackbar} = useSnackbar()

  const handleUpdateTheme = (index: number) => {
    enqueueSnackbar(`${palettes[index].name} Theme`, {variant: "info"})
    updateTheme({palette: palettes[index]})
  }

  const getPaletteButton = (index: number) => (

    <Fab
      onClick={() => handleUpdateTheme(index)}
      key={index}
      sx={{
        background:
          `linear-gradient( 
            -25deg, 
            ${palettes[index].secondary.main} -50%, 
            ${palettes[index].primary.main} 100% )`,
        ":hover":
        {
          background:
            `linear-gradient( 
              -25deg, 
              ${palettes[index].secondary.main} -5%, 
              ${palettes[index].primary.main} 100% )`,
        },
        m: 1,
      }}
      style={{color: theme.palette.getContrastText(palettes[index].primary.main)}}

    >
      <StarIcon
        style={{visibility: fxPalette.name === palettes[index].name ? "visible" : "hidden"}} />
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