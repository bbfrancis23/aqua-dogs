import { alpha, Card, CardHeader, Skeleton, Typography, useTheme } from "@mui/material"
import { useState } from "react"

const SectionStub = () => {

  const theme = useTheme()

  const [isHover, setIsHover] = useState<boolean>(false)

  const getBgColor = () => {
    if(isHover){
      return theme.palette.action.hover
    }
    return theme.palette.background.default
  }

  return (
    <Card onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}
      sx={{bgcolor: alpha(getBgColor(), 0.4), width: '100%'}}>
      <CardHeader
        title={
          isHover ? (
            <>
              <Typography
                sx={{ display: 'flex', alignContent: 'flex-start' }}>CREATE SECTION
              </Typography>
              <Skeleton animation={false}
                variant="rounded" width={'100%'} height={60} />
            </>)
            : (

              <>

                <Skeleton animation={false}>
                  <Typography>CREATE SECTION</Typography>
                </Skeleton>
                <Skeleton animation={false}
                  variant="rounded" width={'100%'} height={60} />
              </>)
        } />
    </Card>
  )

}

export default SectionStub