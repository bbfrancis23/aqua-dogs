import { useState } from "react"
import axios from "axios"
import { useSnackbar } from "notistack"

import { Box, IconButton, Typography } from "@mui/material"
import AddItemIcon from '@mui/icons-material/PostAdd'

import { Tag } from "../../interfaces/TagInterface"
import { Org } from "../../interfaces/OrgInterface"
import { TagItems, getTagItems } from "../../interfaces/TagItems"

import FormModes from "../../enums/FormModes"
import PermissionCodes from "../../enums/PermissionCodes"

import ItemFormDialog from "../items/ItemFormDialog"
import TagBoard from "./TagBoard"

import Permission from "../../ui/Permission"

export interface TagComponentProps {
  tag: Tag ;
  tagItems: TagItems[];
  org?: Org;
}

const TagsComponent = (props: TagComponentProps) => {
  const {tag, org} = props
  const {enqueueSnackbar} = useSnackbar()

  const [tagItems, setTagItems] = useState<TagItems[]>(props.tagItems)
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([tag.id])
  const [addItemDialogIsOpen, setAddItemDialogIsOpen] = useState<boolean>(false)

  const handleCloseDialog = () => {
    setAddItemDialogIsOpen(false)

    axios.get(`/api/items/tags/${tag.id}`).then((res) => {
      if(res.status === axios.HttpStatusCode.Ok){
        setTagItems(getTagItems(tag, res.data.items))
      }else{
        enqueueSnackbar(`Error getting Tagged Items1: ${res.data.message}`, {variant: "error"})
      }
    }).catch((error) => {
      enqueueSnackbar(`Error getting Tagged Items2: ${error}`, {variant: "error"})
    })
    setSelectedTagIds([tag.id])
  }


  const handleUpdateBoardFromDataBase = () => {
    axios.get(`/api/items/tags/${tag.id}`).then((res) => {
      if(res.status === axios.HttpStatusCode.Ok){
        setTagItems(getTagItems(tag, res.data.items))
      }else{
        enqueueSnackbar(`Error getting Tagged Items1: ${res.data.message}`, {variant: "error"})
      }
    }).catch((error) => {
      enqueueSnackbar(`Error getting Tagged Items2: ${error}`, {variant: "error"})
    })
  }

  const handleOpenDialog = (tagId?: string ) => {
    if(tagId){
      setSelectedTagIds([tag.id, tagId])
    }
    setAddItemDialogIsOpen(true)
  }

  return (
    <Box sx={{mt: 8, p: 3}}>
      <Box sx={{ display: 'flex'}}>
        <Typography variant={'h1'} sx={{ fontWeight: '800', pl: 3, fontSize: '3rem'}}
          gutterBottom={true} >
          {tag.title}
        </Typography>
        <Box>
          <Permission roles={[PermissionCodes.SITE_ADMIN]} >
            <IconButton onClick={ () => handleOpenDialog()} sx={{ ml: 3}} >
              <AddItemIcon />
            </IconButton>
          </Permission>
        </Box>
      </Box>
      <TagBoard tagItems={tagItems} tag={tag}
        setItemFormDialogOpen={(id) => handleOpenDialog(id)}
        updateBoardFromDataBase={() => handleUpdateBoardFromDataBase()} />
      <ItemFormDialog mode={FormModes.ADD} dialogIsOpen={addItemDialogIsOpen}
        closeDialog={handleCloseDialog} tagIds={selectedTagIds} org={org ? org : undefined} />
    </Box>
  )
}

export default TagsComponent