import { useState } from "react"
import { Box, Card, CardContent, CardHeader, CardProps, Typography, Skeleton } from "@mui/material"
import { SkeletonProps } from "@mui/material/Skeleton"
import { useTheme, styled } from "@mui/material/styles"
import { Project } from "@/react/project"

export interface ProjectStubProps{ project ?: Project}

const ProjectStubHeader = styled(CardHeader)(() => (
  { '& .MuiCardHeader-content': { width: 'inherit' }})
)

const ProjectStub = ({project}: ProjectStubProps) => {

  const theme = useTheme()

  const getBgColor = () => {
    if(project){
      if(theme.palette.mode === 'light') return 'secondary.main'
      return ''
    } else if (theme.palette.mode === 'dark') { return 'grey.900' }
    return''
  }

  const getTextColor = () => {
    if(project){
      if(theme.palette.mode === 'light') return 'secondary.contrastText'
      return 'secondary.main'
    } else if (theme.palette.mode === 'dark') { return 'grey.900' }
    return''
  }

  const [animation, setAnimation] = useState<false | 'wave'| 'pulse'>(false)

  const cardProps: CardProps = {
    sx: { bgcolor: getBgColor(), width: '100%', color: getTextColor()},
    onMouseEnter: () => setAnimation('pulse'),
    onMouseLeave: () => setAnimation(false)
  }

  const getTitle = () => {
    if(project){
      return (
        <Typography noWrap={true} sx={{ fontSize: '12px', textAlign: 'start', width: 'inherit'}}>
          {project.title}
        </Typography>
      )
    }
    return ( <Skeleton height={19} animation={animation} sx={{ fontSize: '12px'}}/>)
  }

  const skeletonMember: SkeletonProps = {
    variant: 'circular',
    width: 20,
    height: 20,
    sx: {ml: 1, bgcolor: project ? 'secondary.contrastText' : ''},
    animation
  }

  const skeletonBoard: SkeletonProps = {
    animation,
    width: '70%',
    height: 50,
    sx: {
      ml: 2,
      position: 'relative',
      bottom: '10px',
      bgcolor: project ? 'secondary.contrastText' : ''
    }
  }

  return (
    <Card {...cardProps} >
      <ProjectStubHeader
        title={ getTitle()} sx={{ pb: 0.25, width: 'inherit' }} />
      <CardContent sx={{ pt: 0.25 }} style={{paddingBottom: '0'}}>
        <Box sx={{ display: 'flex'}}>
          <Skeleton {...skeletonMember} />
          <Skeleton {...skeletonBoard}/>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ProjectStub

// QA Brian Francis 10-30-23