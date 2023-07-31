import { useState, MouseEvent } from "react";
import { DraggableProvided } from "react-beautiful-dnd";
import { useSnackbar } from "notistack";
import axios, { HttpStatusCode } from "axios";

import { Card, CardContent, CardHeader, IconButton, useTheme, styled,
  Menu, MenuItem } from "@mui/material"
import {useConfirm} from "material-ui-confirm"
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { Item } from "../../interfaces/ItemInterface";
import Permission from "../../ui/old-Permission";
import PermissionCodes from "../../enums/PermissionCodes";

import Link from "next/link"

export interface TagBoardCardProps{
  linkPath: string;
  dragProvided: DraggableProvided;
  item: Item;
  updateBoardFromDataBase: () => void;}


export const ContentPeek = styled("div")((props) => (
  {
    lineHeight: '21px',
    height: '63px',
    overflow: 'hidden',
    position: 'relative',

    "&::after": {
      content: "\"\"",
      position: 'absolute',
      bottom: 0,
      right: 0,
      height: '21px',
      width: '75%',
      background: 'linear-gradient(90deg, transparent, '
      + props.theme.palette.background.default + ')'
    }
  }
))

export const TagBoardCard = (props: TagBoardCardProps ) => {

  const {linkPath, dragProvided, item, updateBoardFromDataBase} = props;

  const confirm = useConfirm()
  const theme = useTheme()
  const {enqueueSnackbar} = useSnackbar()

  const [showOptionsMenu, setShowOptionsMenu] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);


  const handleClick = (event: MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget)

  const handleClose = () => setAnchorEl(null)

  const handleDelete = async () => {

    try{

      await confirm({description: `delete ${item.title}`})
        .then( () => {
          axios.delete(`/api/items/${item.id}`)
            .then( (r) => {
              if(r.status === HttpStatusCode.Ok){
                updateBoardFromDataBase()
                enqueueSnackbar(`Deleted ${item.title}`, {variant: "success"})
              } else{ enqueueSnackbar("Unknown Error", {variant: "error"}) }
            })
            .catch((e) => enqueueSnackbar(`Error Deleting ${e}`, {variant: "error"}) )
        })

    } catch(e){ enqueueSnackbar(`Error Deleting ${e}`, {variant: "error"}) }
    handleClose();
  }


  return (
    <Card sx={{m: 1}} ref={dragProvided.innerRef} {...dragProvided.draggableProps}
      {...dragProvided.dragHandleProps}
      onMouseEnter={() => setShowOptionsMenu(true)} onMouseLeave={() => setShowOptionsMenu(false)} >

      <CardHeader
        title={
          <Link href={`${linkPath}/${item.id}`}
            style={{textDecoration: "none", color: theme.palette.text.primary}} >
            {item.title}
          </Link>
        }

        action = {
          showOptionsMenu && (
            <Permission roles={[PermissionCodes.SITE_ADMIN]}>
              <IconButton aria-label="settings"
                id={`item-menu-button-${item.id}`} onClick={handleClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="item-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': `item-menu-button-${item.id}`,
                }}
              >
                <MenuItem onClick={handleClose}>Edit</MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link href={`${linkPath}/${item.id}`}
                    style={{textDecoration: "none", color: theme.palette.text.primary}}>
                      View
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
              </Menu>
            </ Permission>

          )

        }
      />
      <CardContent>
        {
          (item.sections && item.sections.length > 0 ) &&
        <ContentPeek >
          {item.sections[0].content }
        </ContentPeek>
        }
      </CardContent>
    </Card>
  )


}

export default TagBoardCard