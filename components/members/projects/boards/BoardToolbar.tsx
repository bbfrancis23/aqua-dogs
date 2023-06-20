import { Dispatch, SetStateAction } from "react";
import { Board } from "@/interfaces/BoardInterface";
import { Project } from "@/interfaces/ProjectInterface";
import { Box, Stack, alpha, useTheme } from "@mui/material";
import { Member } from "@/interfaces/MemberInterface";
import { ProjectMemberAvatar } from "../ProjectMemberAvatar";
import { PermissionCodes } from "@/ui/permission/Permission";
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

  const theme = useTheme()

  return (
    <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
      py: 1, px: 3, bgcolor: alpha(theme.palette.background.default, 0.4)}} >
      <BoardTitleForm board={board} project={project}/>
      <Stack direction={'row'} spacing={1}>

        <ProjectMemberAvatar type={PermissionCodes.PROJECT_LEADER} member={project.leader} />
        {
          project?.admins?.map( (a) => (
            <ProjectMemberAvatar type={PermissionCodes.PROJECT_ADMIN} member={a} key={a.id}/>
          ))
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