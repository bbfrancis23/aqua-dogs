import { Box, Card, CardContent, CardHeader, Skeleton, useTheme } from "@mui/material"

export interface ColumnStubProps{

}


export const ColumnStub = (props: ColumnStubProps) => {

  const theme = useTheme()

  return (

    <Card sx={{ width: '272px', bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : ''}}>
      <CardHeader
        title={<Skeleton animation={false}/>}
        sx={{ pb: 0}}
      />
      <CardContent sx={{ pb: 0, pt: 0,}}>
        <Skeleton animation={false} width={240} height={100}/>
      </CardContent>
    </ Card>
  )
}

export default ColumnStub