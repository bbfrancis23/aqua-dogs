import { useState } from "react"
import { alpha, Skeleton, useTheme, Card, CardHeader } from "@mui/material"


const ItemStub = () => {

  const theme = useTheme()

  const [animation, setAnimation] = useState<false | 'wave'| 'pulse'>(false)

  return (
    <Card onMouseEnter={() => setAnimation('pulse')} onMouseLeave={() => setAnimation(false)}
      sx={{bgcolor: alpha(theme.palette.background.default, 0.4),}}>
      <CardHeader
        title={ <Skeleton animation={animation} variant="text"
          sx={{fontSize: '1rem'}}></Skeleton>} />
    </Card>
  )
}

export default ItemStub

// QA: Brian Francisc 8-16-23