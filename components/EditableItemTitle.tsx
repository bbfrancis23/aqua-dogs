import { IconButton, Box, Stack } from "@mui/material"
import EditIcon from '@mui/icons-material/Edit';
import { useState } from "react";
import ItemTitleInput from "./ItemTitleInput";
import DoneIcon from '@mui/icons-material/Done';

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
          <Stack direction={'row'} >
            <ItemTitleInput item={item} setItem={ (item:any) => setItem(item) } />            
              <IconButton size='small' onClick={handleDoneEditing}><DoneIcon color='success' /></IconButton>
          </Stack>       
        :
          <>{item.title}</>
          // TODO ADD This later
          // <>{item.title}<IconButton onClick={handleEdit}><EditIcon /></IconButton></>
         
      }
    </>
  )
}