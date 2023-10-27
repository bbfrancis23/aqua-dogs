import { useState } from "react"
import { Box, BoxProps, Skeleton, Typography } from "@mui/material"
import { useTheme, alpha } from "@mui/material/styles"

export const ColumnStub = () => {

  const theme = useTheme()
  const [animation, setAnimation] = useState<false | 'wave'| 'pulse'>(false)

  const columnStubBoxEffect: BoxProps = {
    sx: { width: '272px', display: 'inline-block' },
    onMouseEnter: () => setAnimation('pulse'),
    onMouseLeave: () => setAnimation(false)
  }

  const columnStubBox: BoxProps = {
    sx: {
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 3,
      width: 272,
      bgcolor: alpha(theme.palette.background.default, 0.4)
    }
  }

  return (
    <Box {...columnStubBoxEffect} >
      <Box {...columnStubBoxEffect}>
        <Typography sx={{p: 2}} ><Skeleton animation={animation} /></Typography>
      </Box>
    </Box>
  )
}

export default ColumnStub

// QA: Brian Francisc 10-25-23