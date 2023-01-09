import React from 'react'
import { useTheme, Stack } from '@mui/material'
import Box from '@mui/material/Box'
import StarIcon from '@mui/icons-material/Star'
import Fab from '@mui/material/Fab'
import { palettes } from '../../theme/themes'

export default function SettingsPalettes(props: any) {
  const theme = useTheme()
  const { palette } = theme
  const fxPalette: any = {...palette}
  const { updateFx } = props
  const paletteCols = 4

  const getPaletteButton = (index: number) => (

    <Fab
      onClick={() => updateFx({ palette: palettes[index] })}
      key={index}
      sx={{
        background:
          `linear-gradient( 
            -25deg, 
            ${palettes[index].secondary.main} -50%, 
            ${palettes[index].primary.main} 100% )`,
        ':hover':
        {
          background:
            `linear-gradient( 
              -25deg, 
              ${palettes[index].secondary.main} -5%, 
              ${palettes[index].primary.main} 100% )`,
        },
        m: 1,
      }}
      style={{ color: theme.palette.getContrastText(palettes[index].primary.main) }}

    >
      <StarIcon style={{ visibility: fxPalette.name === palettes[index].name ? 'visible' : 'hidden' }} />
    </Fab>
  )

  return (
    < >

      <span>Palette:</span>
      <Stack direction={'row'}>

        { palettes.slice(0, paletteCols).map((t, index) => getPaletteButton(index)) }

      </Stack>
      <Stack direction={'row'} >
        { palettes.slice(paletteCols, paletteCols + paletteCols)
          .map((t, index) => getPaletteButton((index + paletteCols))) }
      </Stack>
    </>

  )
}
