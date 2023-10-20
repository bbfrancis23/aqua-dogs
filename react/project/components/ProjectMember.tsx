import { useContext } from "react"

import { Avatar, Badge, Card, CardHeader, Typography } from "@mui/material"
import LeaderBadge from '@mui/icons-material/Star'
import AdminBadge from '@mui/icons-material/Shield'

import { Member } from "@/react/members/member-types"

import Permission, { PermissionCodes, NoPermission } from "fx/ui/PermissionComponent"

import ProjectMemberActions from "./ProjectMemberActions"
import { ProjectContext } from "@/react/project/"
import { useSession } from "next-auth/react"
/* eslint-disable */

export interface ProjectMemberProps {
  type: PermissionCodes;
  member: Member;
  sessionMember: Member;
}

const ProjectMember = ( props: ProjectMemberProps) => {

  const {type, member, sessionMember} = props;



  const {project, setProject} = useContext(ProjectContext)

  const getAvatar = () => {
    let avatar = '';
    if(! member) return ''

    if(member.name){
      const names = member.name.split(' ')
      const firstInitial = names[0].charAt(0);
      const secondInitial = names[1] ? names[1].charAt(0) : '';
      avatar = [firstInitial, secondInitial].join('')
    }else{ avatar = member.email.charAt(0) }

    return avatar
  }

  const getImgAvatar = () => {

    if(! member) return ''
    if(! member.image) return ''
    return member.image
    
  }

  const getMemberLabel = () => {
    if(type === PermissionCodes.PROJECT_LEADER) return 'Leader: '
    else if(type === PermissionCodes.PROJECT_ADMIN) return 'Admin: '
    return 'Member: '
  }

  const getBadge = () => {
    if (type === PermissionCodes.PROJECT_LEADER) {
      return (<LeaderBadge fontSize="small" />)
    }
    return (<AdminBadge fontSize="small" />)
  }

  const getMemberActions = () => {
    if(type === PermissionCodes.PROJECT_LEADER){
      return <></>
    }
    return <ProjectMemberActions sessionMember={sessionMember} member={member} type={type}/>
  }

  return (
    <Card>
      <CardHeader
        title={ <Typography variant={'body1'}>{ getMemberLabel() + member.name }</Typography> }
        subheader={member.email}
        action={ getMemberActions() }
        avatar={
          <>
            <Permission code={PermissionCodes.PROJECT_ADMIN} project={project} member={member}>
              <Badge overlap="circular" badgeContent={getBadge() }
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} >
                <Avatar src={getImgAvatar()}
                  sx={{ bgcolor: 'primary.light', color: 'primary.contrastText',
                    width: 50, height: 50}} >
                  {getAvatar()}
                </Avatar>
              </Badge>
            </Permission>
            <NoPermission code={PermissionCodes.PROJECT_ADMIN} project={project} member={member}>
              <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.contrastText',
                width: 50, height: 50}} >
                {getAvatar()}
              </Avatar>
            </NoPermission>
          </>
        }
      />
    </Card>
  )
}

export default ProjectMember
// QA done