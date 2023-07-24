import { Box, Card, CardContent, CardHeader, Skeleton, Typography, useTheme } from "@mui/material";
import { Project } from "../../../interfaces/ProjectInterface";

export interface ProjectStubProps{
  project ?: Project
}

const ProjectStub = (props: ProjectStubProps) => {

  const theme = useTheme()

  const {project} = props;

  const getBgColor = () => {
    if(project){
      return 'secondary.main'
    } else if (theme.palette.mode === 'dark') { return 'grey.900' }
    return''
  }

  return (
    <Card sx={{ bgcolor: getBgColor(),
      color: project ? 'secondary.contrastText' : ''}}>
      <CardHeader title={ project ?
        <Typography width={100}
          sx={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
          {project.title}
        </Typography>
        : <Skeleton width={100} height={25} animation={false}/>}
      sx={{ pb: 0.25}} />
      <CardContent sx={{ pt: 0.25 }} style={{paddingBottom: '0'}}>
        <Box sx={{ display: 'flex'}}>
          <Skeleton variant="circular" width={20} height={20}
            sx={{ml: 1, bgcolor: project ? 'secondary.contrastText' : ''}} animation={false}/>
          <Skeleton animation={false} width={50} height={50}
            sx={{ml: 2, position: 'relative', bottom: '10px',
              bgcolor: project ? 'secondary.contrastText' : '' }} />
        </Box>
      </CardContent>
    </Card>)
}

export default ProjectStub