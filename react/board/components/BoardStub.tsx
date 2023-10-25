import { useState } from "react"
import { Box, Card, CardContent, CardHeader, Skeleton, Typography} from "@mui/material"
import { useTheme, styled } from "@mui/material/styles"
import { Board } from "@/react/board"
export interface BoardStubProps{ board ?: Board}

const BoardTitle = styled(Typography)(({theme}) => ({
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  width: '70%',
  maxWidth: '165px',
  color: theme.palette.secondary.contrastText,
  fontSize: '12px',
  textAlign: 'start'
}))

const SkeletonCol = styled(Skeleton)(({theme}) => ({
  position: 'relative',
  bottom: '10px',
  width: '28px',
  height: '75px',
}))


const BoardStub = ({board}: BoardStubProps) => {

  const theme = useTheme()

  const getBgColor = () => {
    if(board) return 'secondary.main'
    if (theme.palette.mode === 'dark') return 'grey.900'
    return ''
  }

  const getTextColor = () => {
    if(board){
      if(theme.palette.mode === 'light'){
        return 'secondary.contrastText'
      }
      return 'secondary.main'
    } else if (theme.palette.mode === 'dark') { return 'grey.900' }
    return''
  }

  const getColColor = () => (board ? 'secondary.contrastText' : '')

  const [animation, setAnimation] = useState<false | 'wave'| 'pulse'>(false)

  return (
    <Card sx={{ bgcolor: getBgColor(), width: '100%', color: getTextColor()}}
      onMouseEnter={() => setAnimation('pulse')} onMouseLeave={() => setAnimation(false)}
    >
      <CardHeader
        title={ board ?
          <BoardTitle >{board.title}</BoardTitle>
          : <Skeleton width={100} height={18} animation={animation}/>}
        sx={{ pb: 0}}
      />
      <CardContent sx={{ pt: 0.25 }} style={{paddingBottom: '0'}}>
        <Box sx={{ display: 'flex'}}>
          <SkeletonCol animation={animation} sx={{ bgcolor: getColColor() }} />
          <SkeletonCol animation={animation} sx={{ml: 1, bgcolor: getColColor() }} />
          <SkeletonCol animation={animation} sx={{ml: 1, bgcolor: getColColor() }} />
          <SkeletonCol animation={animation} sx={{ml: 1, bgcolor: getColColor() }} />
        </Box>
      </CardContent>
    </Card>)
}

export default BoardStub

// QA Brian Francis 10-24-23