import { Box, alpha, Skeleton, Typography, useTheme } from "@mui/material"

export interface ColumnStubProps{

}


export const ColumnStub = (props: ColumnStubProps) => {

  const theme = useTheme()

  return (
    <Box sx={{ width: '272px', borderRadius: 2, display: 'inline-block' }} >
      <Box sx={{
        display: 'flex', flexDirection: 'column',
        bgcolor: alpha(theme.palette.background.default, 0.4), borderRadius: 3, width: 272
      }}>
        <Typography sx={{p: 2}} >
          <Skeleton animation={false} />
        </Typography>
      </Box>
    </Box>
  )
}

export default ColumnStub