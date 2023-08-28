import { useContext, } from "react";

import { Box, IconButton, Stack, alpha, useTheme } from "@mui/material";
import PublicIcon from '@mui/icons-material/Public';
import PrivateIcon from '@mui/icons-material/Lock';

import { Member } from "@/interfaces/MemberInterface";
import { ProjectContext } from "@/interfaces/ProjectInterface";

import { PermissionCodes } from "@/ui/PermissionComponent";

import { BoardTitleForm } from "./forms/BoardTitleForm";
import { ProjectMemberAvatar } from "../ProjectMemberAvatar";
import BoardOptionsMenu from "./BoardOptionsMenu";
import { BoardContext } from "@/interfaces/BoardInterface";
import Scope from "@/interfaces/ScopeInterface";
import axios from "axios";
import { useSnackbar } from "notistack";


export const BoardToolbar = () => {

  const {project} = useContext(ProjectContext)

  const {enqueueSnackbar} = useSnackbar()
  const {board, setBoard} = useContext(BoardContext)


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

  const handleChangeScope = async () => {

    const newScope = board.scope === Scope.PUBLIC ? Scope.PRIVATE : Scope.PUBLIC
    try{

      await axios.patch(`/api/members/projects/${project.id}/boards/${board.id}`, {scope: newScope})
        .then((res) => {
          enqueueSnackbar(`Made ${board.title} ${newScope}`, {variant: "success"})
          setBoard({...board, scope: newScope})
        }).catch((error) => {
          enqueueSnackbar(`ERROR updating board scope: ${error.response.data.message}`,
            {variant: "error"})
        })

    }catch(e){
      enqueueSnackbar(`Error Making Board Public ${e}`, {variant: "error"})
    }
  }


  return (
    <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
      py: 1, px: 3, bgcolor: alpha(theme.palette.background.default, 0.4)}} >
      <Stack direction={'row'} spacing={1}>
        { board.scope !== Scope.PUBLIC && (
          <IconButton aria-label="delete" color={'error'}
            onClick={() => handleChangeScope()}>
            <PrivateIcon />
          </IconButton>
        ) }
        {
          board.scope === Scope.PUBLIC && (
            <IconButton aria-label="delete" color={'success'}
              onClick={() => handleChangeScope()}>
              <PublicIcon />
            </IconButton>
          )
        }
        <BoardTitleForm />
      </Stack>
      <Stack direction={'row'} spacing={1}>
        <ProjectMemberAvatar type={PermissionCodes.PROJECT_LEADER} member={project.leader} />
        { project?.admins?.map( (a: Member) => (
          <ProjectMemberAvatar type={PermissionCodes.PROJECT_ADMIN} member={a} key={a.id}/>
        ))}
        { project?.members?.map( (a: Member) => (
          <ProjectMemberAvatar type={PermissionCodes.PROJECT_MEMBER} member={a} key={a.id}/>
        ))}
        <BoardOptionsMenu />
      </Stack>
    </Box>
  )
}
// QA: Brian Francisc 8-13-23