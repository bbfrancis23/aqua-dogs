import { Box, Button, Fade, IconButton, Menu, MenuItem, MenuList } from "@mui/material"
import MenuIcon from '@mui/icons-material/MoreVert';
import { useSnackbar } from "notistack";
import { useConfirm } from "material-ui-confirm";
import { useState, MouseEvent, useContext } from "react";
import { Column } from "@/interfaces/Column";
import { ProjectContext } from "@/interfaces/ProjectInterface";
import { MemberContext } from "@/interfaces/MemberInterface";
import { BoardContext } from "@/interfaces/BoardInterface";
import axios from "axios";
import Permission, { PermissionCodes } from "@/ui/PermissionComponent";


export interface ArchiveColumnProps {
  column: Column
}

const ArchiveColumnForm = (props: ArchiveColumnProps) => {
  const {column} = props

  const {project} = useContext(ProjectContext)
  const {member} = useContext(MemberContext)
  const {board, setBoard} = useContext(BoardContext)

  const {enqueueSnackbar} = useSnackbar()
  const confirm = useConfirm()

  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorElement)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(event.currentTarget);
  }

  const handleClose = () => setAnchorElement(null)

  const handleArchive = async () => {
    try{
      await confirm({description: `Archive ${column.title}`})
        .then( () => {
          axios.delete(
            `/api/members/projects/${project.id}/boards/${board.id}/columns/${column.id}`)
            .then((res) => {
              enqueueSnackbar(`Archived ${column.title}`, {variant: "success"})

              console.log(res.data.board)

              setBoard(res.data.board)

            //router.push(`/member/projects/${project.id}`)
            }).catch((error) => {
              enqueueSnackbar(`Error Archiving Board: ${error.response.data.message}`,
                {variant: "error"})
            })
        })
        .catch((e) => enqueueSnackbar('Archiving aborted', {variant: "error"}) )
    }catch(e){
      enqueueSnackbar(`Error Archiving ${e}`, {variant: "error"})
    }
  }

  return (
    <Permission code={PermissionCodes.PROJECT_LEADER} project={project} member={member} >
      <Box>
        <IconButton onClick={handleClick}>
          <MenuIcon />
        </IconButton>
        <Menu id="col-menu" anchorEl={anchorElement}
          open={open} onClose={handleClose} TransitionComponent={Fade}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuList dense={true} >
            <MenuItem>
              <Button variant={'contained'} color="error" onClick={() => handleArchive()}>
              ARCHIVE COLUMN
              </Button>
            </MenuItem>
            <MenuItem >
              <Button variant={'outlined'} sx={{width: '100%'}} onClick={() => handleClose()}>
              CLOSE
              </Button>
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Permission>
  )
}

export default ArchiveColumnForm