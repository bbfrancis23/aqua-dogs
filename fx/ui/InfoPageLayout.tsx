import { Box, Grid, Typography, styled } from "@mui/material"

export interface InfoPageLayoutComponent{
  title: string | JSX.Element
  children: JSX.Element | JSX.Element [];
}

const GridHeader = styled(Grid)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  borderBottom: '1px solid',
  borderColor: theme.palette.divider,
}))

const TitleSx = {p: 5, pl: {sm: 2, md: 0}, fontSize: {xs: '2rem', sm: '3rem'}, width: '100%' }

export const InfoPageLayout = (props: InfoPageLayoutComponent) => {
  const {title, children} = props

  return (
    <Grid container spacing={0} >
      <GridHeader item xs={12} >
        <Box sx={{width: '1200px', display: 'flex', justifyContent: 'left'}}>
          { typeof title === 'string' ?
            ( <Typography sx={TitleSx} variant={'h1'} noWrap >{title}</Typography> )
            : title
          }
        </Box>
      </GridHeader>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: "center", p: 3 }}>
        <Box sx={{width: '1200px', display: 'flex', justifyContent: 'left' }}>{children}</Box>
      </Grid>
    </Grid>
  )
}

export default InfoPageLayout
// QA: Brian Francis 10-20-23