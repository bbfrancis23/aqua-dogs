import { useState } from "react"
import { Button, TextField, Dialog, DialogTitle,Stack, 
  DialogContent,DialogActions,  } from "@mui/material"
import TagsMultiSelect from "./TagsMultiSelect"
import SelctionsInupt from "./SectionsInput";

import ItemTitleInput from "./ItemTitleInput";

export default function AddItemDialog(props: any){
  const {dialogIsOpen, closeDialog} = props
  const [item, setItem] = useState('')


  function handleSetItem(item: any){ 
    setItem(item)
  }

  return (
    <Dialog open={dialogIsOpen}>
      <DialogTitle>Add New Item</DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <ItemTitleInput item={item} setItem={(item: any) => handleSetItem(item)}/>
          <TagsMultiSelect  item={item} setItem={(item: any) => handleSetItem(item)} />         
          <SelctionsInupt />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>CANCEL</Button>
      </DialogActions>
    </Dialog>
  )
  

}