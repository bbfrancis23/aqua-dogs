import { useState } from "react"
import { Button, TextField, Dialog, DialogTitle,Stack, 
  DialogContent,DialogActions,  } from "@mui/material"
import TagsMultiSelect from "./TagsMultiSelect"
import SelctionsInupt from "./SectionsInput";

import ItemTitleInput from "./ItemTitleInput";

export default function AddItemDialog(props: any){
  const {dialogIsOpen, closeDialog} = props
  const [itemId, setItemId] = useState('')


  function handleSetItemId(itemId: string){ 
    setItemId(itemId)
  }

  return (
    <Dialog open={dialogIsOpen}>
      <DialogTitle>Add New Item</DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <ItemTitleInput itemId={itemId} setItemId={(itemId: string) => handleSetItemId(itemId)}/>
          <TagsMultiSelect />         
          <SelctionsInupt />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>CANCEL</Button>
      </DialogActions>
    </Dialog>
  )
  

}