import { useState } from "react"
import { alpha, Skeleton, useTheme, Card, CardHeader } from "@mui/material"


const ItemStub = () => {

  const theme = useTheme()

  const [animation, setAnimation] = useState<false | 'wave'| 'pulse'>(false)

  const getBgColor = () => {

    if(theme.palette.mode === 'light'){

      return 'secondary.main'
    }
    return ''

  }

  const getTextColor = () => {

    if(theme.palette.mode === 'light'){

      return 'secondary.contrastText'
    }
    return 'secondary.main'
  }

  return (
    <Card onMouseEnter={() => setAnimation('pulse')} onMouseLeave={() => setAnimation(false)}
      sx={{bgcolor: getBgColor()}}>
      <CardHeader
        title={ <Skeleton animation={animation} variant="text"
          sx={{fontSize: '1rem'}}></Skeleton>} />
    </Card>
  )
}

export default ItemStub

// QA: Brian Francisc 8-16-23