import { Theme, useTheme } from "@emotion/react";
import { Box, Grid, Typography } from "@mui/material";

export interface InfoPageLayoutProps{
  title: string;

  children: JSX.Element | JSX.Element [];
}

export const InfoPageLayout = (props: InfoPageLayoutProps) => {
  const {title, children} = props

  const theme: any = useTheme();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}
        sx={{ display: 'flex', justifyContent: "center",
          borderBottom: '1px solid', borderColor: 'divider'}} >
        <Box sx={{width: '1200px', display: 'flex', justifyContent: 'left'}}>
          <Typography variant={'h2'}
            sx={{p: 5,
              pl: 2,
              fontSize: {xs: '2rem', sm: '3rem'} }}>{title}</Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: "center", ml: 3,
        maxHeight:       {xs: 'calc(100vh - 210px)', md: 'calc(100vh - 235px)'}, overflow: 'auto'}}>
        <Box sx={{width: '1200px', display: 'flex', justifyContent: 'left'}}>
          {children}
        </Box>
      </Grid>
    </Grid>
  )
}

export default InfoPageLayout