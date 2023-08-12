import { alpha, Skeleton, Typography, useTheme, Card, CardHeader } from "@mui/material"
import { useState } from "react"


const ItemStub = () => {

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
      sx={{bgcolor: alpha(getBgColor(), 0.4),}}>
      <CardHeader
        title={
          isHover ? (<Typography
            sx={{ display: 'flex', alignContent: 'flex-start' }}>Create Item</Typography>)
            : ( <Skeleton animation={false}><Typography>Create Item</Typography></Skeleton>)
        } />
    </Card>
  )
}

export default ItemStub

// QA: Brian Francisc 8-12-23