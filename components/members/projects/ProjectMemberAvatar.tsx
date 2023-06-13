import { Avatar, Badge } from "@mui/material";
import { Member } from "../../../interfaces/MemberInterface";
import { Project } from "../../../interfaces/ProjectInterface";

import LeaderBadge from '@mui/icons-material/Star';

import AdminBadge from '@mui/icons-material/Shield';
import { PermissionCodes } from "../../../ui/permission/Permission";

export interface ProjectMemberAvatarProps {
  type: PermissionCodes;
  member: Member;
}

export const ProjectMemberAvatar = ( props: ProjectMemberAvatarProps) => {

  const {type, member} = props

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


  return (
    <>
      {

        (type === PermissionCodes.PROJECT_MEMBER) &&
      (

        <Avatar sx={{ fontSize: '1.25rem',
          color: 'secondary.contrastText', bgcolor: 'secondary.main', width: 40, height: 40}} >
          {getAvatar()}
        </Avatar>
      )
      }
      {
        type === PermissionCodes.PROJECT_LEADER && (
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={<LeaderBadge sx={{ color: 'primary.dark', width: '30', height: 30}}/>} >
            <Avatar sx={{ fontSize: '1.25rem',
              color: 'secondary.contrastText', bgcolor: 'secondary.main', width: 40, height: 40}} >
              {getAvatar()}
            </Avatar>
          </Badge>
        )
      }

      {
        type === PermissionCodes.PROJECT_ADMIN && (
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={<AdminBadge sx={{ color: 'primary.dark', width: '15', height: 15}}/>} >
            <Avatar sx={{ fontSize: '1.25rem',
              color: 'secondary.contrastText', bgcolor: 'secondary.main', width: 40, height: 40}} >
              {getAvatar()}
            </Avatar>
          </Badge>
        )
      }

    </>
  )

}