import { IconButton, Box, Stack, Chip } from "@mui/material"
import EditIcon from '@mui/icons-material/Edit';
import { useState } from "react";
import DoneIcon from '@mui/icons-material/Done';
import TagsMultiSelect from "./TagsMultiSelect";

export default function EditableItemTitle( props: any){
  const {item, setItem} = props

  const [editing, setEditing] = useState(false)

  const handleEdit = () => {
    setEditing(true)
  }

  const handleDoneEditing = () => {
    setEditing(false)
  }

  return (
    <>
      {
        editing 
        ? 
          <Stack direction={'row'} sx={{ width: '100%'}}>
            <TagsMultiSelect  item={item} setItem={(item: any) => setItem(item)} /> 
            <IconButton onClick={handleDoneEditing}><DoneIcon color='success' /></IconButton>
          </Stack>       
        : 
          <></>
          // TODO add this later
          // <>
          //    { item.tags?.map( (t:any) =>(<Chip size='small' label={t.title} color="primary" key={t.id}/>)) }
          //   <IconButton onClick={handleEdit}><EditIcon /></IconButton>
          // </>
         
      }
    </>
  )
}