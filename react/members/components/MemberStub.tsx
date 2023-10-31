import { useState } from "react"
import { Avatar, Card, CardHeader, CardProps, Skeleton, Typography } from "@mui/material"
import { CardHeaderProps } from "@mui/material/CardHeader"
import { useTheme } from "@mui/material/styles"
import AddMemberIcon from '@mui/icons-material/PersonAdd'

export interface MemberStubProps { setShowForm: (showForm: boolean) => void}

const MemberStub = ({setShowForm}: MemberStubProps) => {
  const theme = useTheme()

  const [animation, setAnimation] = useState<false | 'wave'| 'pulse'>(false)

  const getBgColor = () => {
    if(theme.palette.mode === 'light'){ return 'grey.300' }
    return 'grey.400'
  }

  const cardProps: CardProps = {
    onClick: () => setShowForm(true),
    onMouseEnter: () => setAnimation('pulse'),
    onMouseLeave: () => setAnimation(false)
  }

  const SkeletonAction = () => (
    <Skeleton variant="circular" animation={animation} sx={{ height: '25px', width: '25px' }}>
      <AddMemberIcon />
    </Skeleton>
  )

  const SkeletonTitle = () => (
    <Skeleton animation={animation} >
      <Typography variant={'body1'}>Project Member Name</Typography>
    </Skeleton>
  )

  const SkeletonText = () => (
    <Skeleton animation={animation} >
      <Typography variant={'body1'}>member.email@gmail.com</Typography>
    </Skeleton>
  )

  const SkeletonAvatar = () => (
    <Skeleton variant="circular" animation={animation} >
      <Avatar sx={{ bgcolor: getBgColor(), width: 50, height: 50}} >
        <AddMemberIcon />
      </Avatar>
    </Skeleton>
  )

  const SkeletonHeaderProps: CardHeaderProps = {
    action: <SkeletonAction />,
    title: <SkeletonTitle />,
    subheader: <SkeletonText />,
    avatar: <SkeletonAvatar />
  }

  return (
    <Card {...cardProps} >
      <CardHeader {...SkeletonHeaderProps}/>
    </Card>
  )
}

export default MemberStub

// QA Brian Francis 10-30-23