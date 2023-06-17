import { Dispatch, SetStateAction } from "react";
import { Board } from "../../../../interfaces/BoardInterface";
import { Project } from "../../../../interfaces/ProjectInterface";
import { Avatar, Badge, Box, Stack, Typography } from "@mui/material";

import LeaderBadge from '@mui/icons-material/Star';
import AdminBadge from '@mui/icons-material/Shield';
import { Member } from "../../../../interfaces/MemberInterface";
import { ProjectMemberAvatar } from "../ProjectMemberAvatar";
import { PermissionCodes } from "../../../../ui/permission/Permission";
import { BoardTitleForm } from "./forms/BoardTitleForm";

export interface BoardToolbarProps{
  project: Project;
  board: Board;
  setBoard: Dispatch<SetStateAction<Board>>;
}

export const BoardToolbar = (props: BoardToolbarProps) => {
  const {project, board, setBoard} = props

  const getAvatar = (member: Member) => {
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
    <Box
      sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
        p: 1, pl: 3, pr: 3, bgcolor: 'rgba(0, 0, 0, .40)'}} >
      {/* <Typography variant="h6" sx={{ display: 'inline'}}>{board.title}</Typography> */}
      <BoardTitleForm board={board} project={project}/>
      <Stack direction={'row'} spacing={1}>

        <ProjectMemberAvatar type={PermissionCodes.PROJECT_LEADER} member={project.leader} />
        {
          project?.admins?.map( (a) => (
            <ProjectMemberAvatar type={PermissionCodes.PROJECT_ADMIN} member={a} key={a.id}/>
          ) )
        }
        {
          project?.members?.map( (a) => (
            <ProjectMemberAvatar type={PermissionCodes.PROJECT_MEMBER} member={a} key={a.id}/>
          ) )
        }
      </Stack>
    </Box>
  )
}