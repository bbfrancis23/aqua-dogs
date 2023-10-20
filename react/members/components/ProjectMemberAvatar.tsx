import { Avatar, Badge } from "@mui/material";
import LeaderBadge from '@mui/icons-material/Star';
import AdminBadge from '@mui/icons-material/Shield';

import { Member } from "@/react/members/member-types";
import { PermissionCodes } from "fx/ui/PermissionComponent";
import { useSession } from "next-auth/react";

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


  const getImgAvatar = () => {

    if(! member) return ''
    if(! member.image) return ''
    return member.image

  }


  return (
    <>
      {

        (type === PermissionCodes.PROJECT_MEMBER) &&
      (

        <Avatar sx={{ fontSize: '1.25rem',
          color: 'secondary.contrastText', bgcolor: 'secondary.main', width: 40, height: 40}}
        src={getImgAvatar()} >
          {getAvatar()}
        </Avatar>
      )
      }
      {
        type === PermissionCodes.PROJECT_LEADER && (
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={<LeaderBadge sx={{ color: 'primary.light', width: '30', height: 30}}/>} >
            <Avatar src={getImgAvatar()} sx={{ fontSize: '1.25rem',
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
            badgeContent={<AdminBadge sx={{ color: 'primary.light', width: '15', height: 15}}/>} >
            <Avatar src={getImgAvatar()} sx={{ fontSize: '1.25rem',
              color: 'secondary.contrastText', bgcolor: 'secondary.main', width: 40, height: 40}} >
              {getAvatar()}
            </Avatar>
          </Badge>
        )
      }

    </>
  )

}

// QA Brian Francisc 8-12-21