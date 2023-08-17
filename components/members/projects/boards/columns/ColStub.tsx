import { Box, alpha, Skeleton, Typography, useTheme } from "@mui/material"
import { useState } from "react"

export const ColumnStub = () => {

  const theme = useTheme()

  const [animation, setAnimation] = useState<false | 'wave'| 'pulse'>(false)

  return (
    <Box onMouseEnter={() => setAnimation('pulse')} onMouseLeave={() => setAnimation(false)}
      sx={{ width: '272px', display: 'inline-block' }} >
      <Box sx={{ display: 'flex', flexDirection: 'column', borderRadius: 3, width: 272,
        bgcolor: alpha(theme.palette.background.default, 0.4) }}>
        <Typography sx={{p: 2}} >
          <Skeleton animation={animation} />
        </Typography>
      </Box>
    </Box>
  )
}

export default ColumnStub

// QA: Brian Francisc 8-17-23
// ENHANCEMENTS: Replace numbers with theme vars