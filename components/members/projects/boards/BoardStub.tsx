import { useState } from "react";

import { Box, Card, CardContent, CardHeader, Skeleton, Typography, useTheme } from "@mui/material";

import { Board } from "@/interfaces/BoardInterface";

export interface BoardStubProps{
  board ?: Board
}

const BoardStub = (props: BoardStubProps) => {

  const theme = useTheme()

  const {board} = props;

  const getBgColor = () => {
    if(board){
      return 'secondary.main'
    }else if (theme.palette.mode === 'dark'){
      return 'grey.900'
    }
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

  const [animation, setAnimation] = useState<false | 'wave'| 'pulse'>(false)

  return (
    <Card sx={{ bgcolor: getBgColor(), width: '100%', color: getTextColor()}}
      onMouseEnter={() => setAnimation('pulse')} onMouseLeave={() => setAnimation(false)}
    >
      <CardHeader
        title={ board ?
          <Typography width={100}
            sx={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: '70%',
              maxWidth: '165px', color: 'secondary.contrastText',
              fontSize: '12px', textAlign: 'start'}}>
            {board.title}</Typography>
          : <Skeleton width={100} height={25} animation={animation}/>}
        sx={{ pb: 0}}
      />
      <CardContent sx={{ pt: 0.25 }} style={{paddingBottom: '0'}}>
        <Box sx={{ display: 'flex'}}>
          <Skeleton animation={animation} width={28} height={75}
            sx={{position: 'relative', bottom: '10px',
              bgcolor: board ? 'secondary.contrastText' : '' }} />
          <Skeleton animation={animation} width={28} height={75}
            sx={{ml: 1, position: 'relative', bottom: '10px',
              bgcolor: board ? 'secondary.contrastText' : '' }} />
          <Skeleton animation={animation} width={28} height={75}
            sx={{ml: 1, position: 'relative', bottom: '10px',
              bgcolor: board ? 'secondary.contrastText' : '' }} />
          <Skeleton animation={animation} width={28} height={75}
            sx={{ml: 1, position: 'relative', bottom: '10px',
              bgcolor: board ? 'secondary.contrastText' : '' }} />
        </Box>
      </CardContent>
    </Card>)
}

export default BoardStub

// QA done