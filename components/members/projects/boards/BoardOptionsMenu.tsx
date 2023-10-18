import { Button, Fade, IconButton, Menu, MenuItem } from "@mui/material"

import { useConfirm } from "material-ui-confirm";

import MenuIcon from '@mui/icons-material/MoreVert';
import { useState, MouseEvent, useContext } from "react";
import Permission, { PermissionCodes } from "fx/ui/PermissionComponent";
import { ProjectContext } from "@/interfaces/ProjectInterface";
import { MemberContext } from "@/react/Member/";
import { useSnackbar } from "notistack";
import axios from "axios";
import router from "next/router";
import { BoardContext } from "@/react/board/BoardContext";


const BoardOptionsMenu = () => {

  const {project} = useContext(ProjectContext)
  const {member} = useContext(MemberContext)
  const {board} = useContext(BoardContext)
  const {enqueueSnackbar} = useSnackbar()
  const confirm = useConfirm()

  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorElement)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(event.currentTarget);
  }

  const handleArchive = async () => {
    try{
      await confirm({description: `Archive ${board.title}`})
        .then( () => {
          axios.delete(`/api/members/projects/${project.id}/boards/${board.id}`).then((res) => {
            enqueueSnackbar(`Archived ${board.title}`, {variant: "success"})
            router.push(`/member/projects/${project.id}`)
          }).catch((error) => {
            enqueueSnackbar(`Error Archiving Board: ${error.response.data.message}`,
              {variant: "error"})
          })
        })
        .catch((e) => enqueueSnackbar('Archiving aborted', {variant: "error"}) )
    }catch(e){
      enqueueSnackbar(`Error  Archiving ${e}`, {variant: "error"})
    }
  }


  const handleClose = () => setAnchorElement(null)
  return (
    <Permission code={PermissionCodes.PROJECT_LEADER} project={project} member={member} >
      <IconButton onClick={handleClick}>
        <MenuIcon />
      </IconButton>
      <Menu id="board-menu" anchorEl={anchorElement}
        open={open} onClose={handleClose} TransitionComponent={Fade} >
        <MenuItem>
          <Button variant={'contained'} color="error" onClick={() => handleArchive()}
            sx={{width: '100%'}}>
              ARCHIVE BOARD
          </Button>
        </MenuItem>
        <MenuItem >
          <Button variant={'outlined'} sx={{width: '100%'}} onClick={() => handleClose()}>
              CLOSE
          </Button>
        </MenuItem>
      </Menu>
    </ Permission>
  )
}

export default BoardOptionsMenu

// QA: Brian Francisc 8-13-23