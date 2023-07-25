import { Box, Card, CardContent, CardHeader, Skeleton, Typography, useTheme } from "@mui/material";
import { Project } from "../../../interfaces/ProjectInterface";
import { useState } from "react";

export interface ProjectStubProps{
  project ?: Project
}

const ProjectStub = (props: ProjectStubProps) => {

  const theme = useTheme()

  const {project} = props;

  const getBgColor = () => {
    if(project){
      if(theme.palette.mode === 'light'){

        return 'secondary.main'
      }
      return ''
    } else if (theme.palette.mode === 'dark') { return 'grey.900' }
    return''
  }

  const getTextColor = () => {
    if(project){
      if(theme.palette.mode === 'light'){

        return 'secondary.contrastText'
      }
      return 'secondary.main'
    } else if (theme.palette.mode === 'dark') { return 'grey.900' }
    return''
  }

  const [animation, setAnimation] = useState<false | 'wave'| 'pulse'>(false)

  return (
    <Card onMouseEnter={() => setAnimation('pulse')} onMouseLeave={() => setAnimation(false)}
      sx={{ bgcolor: getBgColor(), width: '100%',
        color: getTextColor()}} >
      <CardHeader title={ project ?
        <Typography
          sx={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: '70%',
            maxWidth: '165px',
            fontSize: '12px', textAlign: 'start'}}>
          {project.title}
        </Typography>
        : <Skeleton height={19} animation={animation} sx={{ fontSize: '12px'}}/>}
      sx={{ pb: 0.25}} />
      <CardContent sx={{ pt: 0.25 }} style={{paddingBottom: '0'}}>
        <Box sx={{ display: 'flex'}}>
          <Skeleton variant="circular" width={20} height={20}
            sx={{ml: 1, bgcolor: project ? 'secondary.contrastText' : ''}} animation={animation} />
          <Skeleton animation={animation} width={'70%'} height={50}
            sx={{ml: 2, position: 'relative', bottom: '10px',
              bgcolor: project ? 'secondary.contrastText' : '' }} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default ProjectStub