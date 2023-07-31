import { useTheme } from "@emotion/react"
import { Box, Grid, Typography } from "@mui/material"


export interface InfoPageLayoutComponent{
  title: string | JSX.Element
  children: JSX.Element | JSX.Element [];
}

export const InfoPageLayout = (props: InfoPageLayoutComponent) => {
  const {title, children} = props

  const theme: any = useTheme();
  return (
    <Grid container spacing={2} sx={{pb: 3}}>
      <Grid item xs={12}
        sx={{ display: 'flex', justifyContent: "center", width: '100%',
          borderBottom: '1px solid', borderColor: 'divider'}} >
        <Box sx={{width: '1200px', display: 'flex', justifyContent: 'left'}}>
          { typeof title === 'string' ?
            ( <Typography sx={{p: 5, pl: 2, fontSize: {xs: '2rem', sm: '3rem'}, width: '100%' }}
              variant={'h2'} noWrap >
              {title}
            </Typography> )
            : title
          }
        </Box>
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: "center", ml: 3 }}>
        <Box sx={{width: '1200px', display: 'flex', justifyContent: 'left' }}>
          {children}
        </Box>
      </Grid>
    </Grid>
  )
}

export default InfoPageLayout
// QA done