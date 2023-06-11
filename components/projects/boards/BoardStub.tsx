import { Box, Card, CardContent, CardHeader, Skeleton, Typography, useTheme } from "@mui/material";
import { Board } from "../../../interfaces/BoardInterface";


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
    return''

  }

  return (
    <Card sx={{ bgcolor: getBgColor(),
      color: board ? 'secondary.contrastText' : ''}}>
      <CardHeader
        title={ board ?
          <Typography width={100} >{board.title}</Typography>
          : <Skeleton width={100} height={25} animation={false}/>}
        sx={{ pb: 0}}
      />
      <CardContent sx={{ pt: 0.25 }} style={{paddingBottom: '0'}}>
        <Box sx={{ display: 'flex'}}>
          <Skeleton
            animation={false} width={28}
            height={75}
            sx={{position: 'relative', bottom: '10px',
              bgcolor: board ? 'secondary.contrastText' : ''
            }} />
          <Skeleton
            animation={false} width={28}
            height={75}
            sx={{ml: 1, position: 'relative', bottom: '10px',
              bgcolor: board ? 'secondary.contrastText' : ''
            }} />
          <Skeleton
            animation={false} width={28}
            height={75}
            sx={{ml: 1, position: 'relative', bottom: '10px',
              bgcolor: board ? 'secondary.contrastText' : ''
            }} />
        </Box>
      </CardContent>
    </Card>)
}

export default BoardStub