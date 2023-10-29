import { useState } from "react"
import { Skeleton, Card, CardHeader, CardProps } from "@mui/material"
import { useTheme } from "@mui/material/styles"


const ItemStub = () => {

  const theme = useTheme()

  const [animation, setAnimation] = useState<false | 'wave'| 'pulse'>(false)

  const getBgColor = () => {
    if(theme.palette.mode === 'light')return 'secondary.main'
    return ''
  }

  const cardProps: CardProps = {
    onMouseEnter: () => setAnimation('pulse'),
    onMouseLeave: () => setAnimation(false),
    sx: { bgcolor: getBgColor() }
  }

  return (
    <Card {...cardProps}>
      <CardHeader
        title={
          <Skeleton animation={animation} variant="text" sx={{fontSize: '1rem'}}></Skeleton>}
      />
    </Card>
  )
}

export default ItemStub

// QA: Brian Francisc 10-28-23