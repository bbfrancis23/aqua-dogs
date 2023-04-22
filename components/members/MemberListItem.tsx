import { Dispatch, SetStateAction, useState } from "react";

import { Avatar, Badge, ListItem, ListItemAvatar, ListItemText } from "@mui/material";

import LeaderBadge from '@mui/icons-material/Star';
import AdminBadge from '@mui/icons-material/Shield';

import { Org } from "../../interfaces/OrgInterface";
import { Member } from "../../interfaces/MemberInterface";

import PermissionCodes from "../../enums/PermissionCodes";

import OrgMemberActions from "../org/OrgMemberActions";

export interface MemberListItemProps {
  type: PermissionCodes;
  member: Member;
  org: Org;
  setOrg: Dispatch<SetStateAction<Org>>;
}


export default function MemberListItem ( props: MemberListItemProps){

  const {member, type, setOrg, org} = props

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
    if(type === PermissionCodes.ORG_LEADER) return 'Leader: '
    else if(type === PermissionCodes.ORG_ADMIN) return 'Admin: '
    return 'Member: '
  }

  const getBadge = () => {
    if (type === PermissionCodes.ORG_LEADER) {
      return (<LeaderBadge color="primary" fontSize="small" />)
    }
    return (<AdminBadge color="primary" fontSize="small" />)
  }

  const getMemberActions = () => {
    if(type === PermissionCodes.ORG_ADMIN){
      return <OrgMemberActions org={org} setOrg={setOrg} member={member} isAdmin={true}/>
    } else if (type === PermissionCodes.ORG_MEMEBER){
      return <OrgMemberActions org={org} setOrg={setOrg} member={member} isAdmin={false}/>
    }

    return <></>
  }

  return (
    <ListItem alignItems="flex-start"
      secondaryAction={ getMemberActions() }
    >
      <ListItemAvatar>
        {
          (type === PermissionCodes.ORG_LEADER || type === PermissionCodes.ORG_ADMIN) && (
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
          (type === PermissionCodes.ORG_MEMEBER) && (

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