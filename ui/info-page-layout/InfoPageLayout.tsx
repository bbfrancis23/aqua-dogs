import { Theme, useTheme } from "@emotion/react";
import { Box, Grid, Typography } from "@mui/material";
import { isValidElement } from "react";

export interface InfoPageLayoutProps{
  title: string | JSX.Element

  children: JSX.Element | JSX.Element [];
}

export const InfoPageLayout = (props: InfoPageLayoutProps) => {
  const {title, children} = props

  const theme: any = useTheme();
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}
        sx={{ display: 'flex', justifyContent: "center", width: '100%',
          borderBottom: '1px solid', borderColor: 'divider'}} >
        <Box sx={{width: '1200px', display: 'flex', justifyContent: 'left'}}>

          {
            typeof title === 'string' ? (
              <Typography variant={'h2'} noWrap
                sx={{p: 5,
                  pl: 2,
                  fontSize: {xs: '2rem', sm: '3rem'}, width: '100%' }}>{title}</Typography>
            ) : title
          }


        </Box>
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: "center", ml: 3,

        maxHeight: {xs: 'calc(100vh - 180px)', md: 'calc(100vh - 210px)'},
        overflow: 'auto', overflowX: 'hidden'}}>
        <Box sx={{width: '1200px', display: 'flex', justifyContent: 'left' }}>
          {children}
        </Box>
      </Grid>
    </Grid>
  )
}

export default InfoPageLayout