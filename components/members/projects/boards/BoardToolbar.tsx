import { useContext, useState, MouseEvent} from "react";

import { Box, IconButton, Stack, alpha,
  useTheme, styled, Menu, MenuItem, Fade } from "@mui/material";
import PublicIcon from '@mui/icons-material/Public';
import PrivateIcon from '@mui/icons-material/Lock';
import DropDownMenuIcon from '@mui/icons-material/ArrowDropDownCircle';
import { useSnackbar } from "notistack";

import axios from "axios";

import { Member } from "@/react/member/member-types";
import { ProjectContext } from "@/react/project/project-types";

import { PermissionCodes } from "fx/ui/PermissionComponent";

import { BoardTitleForm } from "./forms/BoardTitleForm";
import { ProjectMemberAvatar } from "../../../../react/member/components/ProjectMemberAvatar";
import BoardOptionsMenu from "./BoardOptionsMenu";
import { BoardContext } from "@/react/board/BoardContext";
import Scope from "@/interfaces/ScopeInterface";
import { Board } from "@/react/board/board-types";


const BoardToolbarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 3, 1, 3),
  backgroundColor: alpha(theme.palette.background.default, 0.7)
}));

export interface BoardToolbarProps {
  projectBoards: Board[];
}

export const BoardToolbar = (props: BoardToolbarProps) => {

  const {projectBoards} = props


  const theme = useTheme()
  const {enqueueSnackbar} = useSnackbar()
  const {project} = useContext(ProjectContext)
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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl)


  const handleShowBoardMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (board: Board):void => {
    setAnchorEl(null)
  }

  return (
    <BoardToolbarContainer >
      <Stack direction={'row'} spacing={1}>
        { board.scope !== Scope.PUBLIC && (
          <IconButton aria-label="delete" color={'error'} onClick={() => handleChangeScope()}>
            <PrivateIcon />
          </IconButton>
        )}
        { board.scope === Scope.PUBLIC && (
          <IconButton aria-label="delete" color={'success'} onClick={() => handleChangeScope()}>
            <PublicIcon />
          </IconButton>
        ) }
        <BoardTitleForm />
        <IconButton onClick={handleShowBoardMenu} >
          <DropDownMenuIcon />
        </IconButton>
        <Menu id="board-list" anchorEl={anchorEl} open={open} TransitionComponent={Fade}
          onClose={handleClose} anchorOrigin={{horizontal: 'center', vertical: 'bottom'}}>
          { projectBoards.map( (b: Board) => (
            <MenuItem key={b.id}
              selected={board.id === b.id}>
              <a href={`/member/projects/${project.id}/boards/${b.id}`}
                style={{textDecoration: "none", color: theme.palette.text.primary}}>{b.title}</a>
            </MenuItem>
          ))}
        </Menu>
      </Stack>
      <Stack direction={'row'} spacing={1}>
        <ProjectMemberAvatar type={PermissionCodes.PROJECT_LEADER} member={project.leader} />
        { project?.admins?.map( (admin: Member) => (
          <ProjectMemberAvatar type={PermissionCodes.PROJECT_ADMIN} member={admin} key={admin.id}/>
        ))}
        { project?.members?.map( (m: Member) => (
          <ProjectMemberAvatar type={PermissionCodes.PROJECT_MEMBER} member={m} key={m.id}/>
        ))}
        <BoardOptionsMenu />
      </Stack>
    </BoardToolbarContainer>
  )
}
// QA: Brian Francisc 9-22-23