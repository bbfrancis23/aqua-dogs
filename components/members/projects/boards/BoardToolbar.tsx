import { useContext, } from "react";

import { Box, Stack, alpha, useTheme } from "@mui/material";

import { Member } from "@/interfaces/MemberInterface";
import { ProjectContext } from "@/interfaces/ProjectInterface";

import { PermissionCodes } from "@/ui/PermissionComponent";

import { BoardTitleForm } from "./forms/BoardTitleForm";
import { ProjectMemberAvatar } from "../ProjectMemberAvatar";
import ArchiveBoardForm from "./forms/ArchiveBoardForm";


export const BoardToolbar = () => {

  const {project} = useContext(ProjectContext)


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
      <BoardTitleForm />
      <Stack direction={'row'} spacing={1}>
        <ProjectMemberAvatar type={PermissionCodes.PROJECT_LEADER} member={project.leader} />
        { project?.admins?.map( (a: Member) => (
          <ProjectMemberAvatar type={PermissionCodes.PROJECT_ADMIN} member={a} key={a.id}/>
        ))}
        { project?.members?.map( (a: Member) => (
          <ProjectMemberAvatar type={PermissionCodes.PROJECT_MEMBER} member={a} key={a.id}/>
        ))}
        <ArchiveBoardForm />
      </Stack>
    </Box>
  )
}
// QA: Brian Francisc 8-13-23