import { Card, CardHeader,
  Skeleton, Typography} from "@mui/material"

import { useTheme, alpha } from "@mui/material/styles"
import { useState } from "react"

const SectionStub = () => {

  const theme = useTheme()

  const [animation, setAnimation] = useState<false | 'wave'| 'pulse'>(false)


  return (
    <Card onMouseEnter={() => setAnimation('pulse')}
      onMouseLeave={() => setAnimation(false)}
      sx={{bgcolor: alpha(theme.palette.background.default, 0.4)}}>
      <CardHeader
        title={
          <>
            <Skeleton animation={animation}>
              <Typography>CREATE SECTION</Typography>
            </Skeleton>
            <Skeleton animation={animation} variant="rounded" width={'100%'} height={60} />
          </>
        } />
    </Card>
  )

}

export default SectionStub


// QA Brian Francis 8-23-23