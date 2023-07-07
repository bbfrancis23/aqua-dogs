import { Avatar, Badge, ListItem, ListItemAvatar, ListItemText } from "@mui/material"
import { PermissionCodes } from "../../../ui/permission/Permission"
import { Member } from "../../../interfaces/MemberInterface";
import { useContext } from "react";

import LeaderBadge from '@mui/icons-material/Star';
import AdminBadge from '@mui/icons-material/Shield';
import ProjectMemberActions from "./ProjectMemberActions";

import { ProjectContext } from "pages/member/projects/[projectId]";

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
    if(member){
      if(member.name){
        const names = member.name.split(' ')
        const firstInitial = names[0].charAt(0);
        const secondInitial = names[1] ? names[1].charAt(0) : '';
        avatar = [firstInitial, secondInitial].join('')
      }else{ avatar = member.email.charAt(0) }
    }
    return avatar
  }

  const getMemberLabel = () => {
    if(type === PermissionCodes.PROJECT_LEADER) return 'Leader: '
    else if(type === PermissionCodes.PROJECT_ADMIN) return 'Admin: '
    return 'Member: '
  }

  const getBadge = () => {
    if (type === PermissionCodes.PROJECT_LEADER) {
      return (<LeaderBadge color="primary" fontSize="small" />)
    }
    return (<AdminBadge color="primary" fontSize="small" />)
  }

  const getMemberActions = () => {

    if(type === PermissionCodes.PROJECT_LEADER){
      return <></>
    }
    return <ProjectMemberActions
      sessionMember={sessionMember}
      project={project} setProject={setProject} member={member} type={type}/>


  }

  return (
    <ListItem alignItems="flex-start" secondaryAction={ getMemberActions() }>
      <ListItemAvatar>
        {
          (type === PermissionCodes.PROJECT_LEADER || type === PermissionCodes.PROJECT_ADMIN) && (
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={getBadge() } >
              <Avatar sx={{ bgcolor: 'secondary.main', width: 50, height: 50}} >
                {getAvatar()}
              </Avatar>
            </Badge>
          )
        }
        {
          (type === PermissionCodes.PROJECT_MEMBER) && (

            <Avatar sx={{ bgcolor: 'secondary.main', width: 50, height: 50}} >
              {getAvatar()}
            </Avatar>
          )
        }
      </ListItemAvatar>
      <ListItemText
        primary={ getMemberLabel() + member.name}
        secondary={` ${member.email}`}
      />
    </ListItem>
  )


}

export default ProjectMember