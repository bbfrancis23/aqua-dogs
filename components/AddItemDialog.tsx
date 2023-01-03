import { useState } from "react"
import { Button, FormControl, InputLabel, Select, TextField, Dialog, DialogTitle, OutlinedInput, Stack,
  DialogContent,DialogActions, SelectChangeEvent, MenuItem, useTheme } from "@mui/material"
import TagsMultiSelect from "./TagsMultiSelect"



export default function AddItemDialog(props: any){

  const {dialogIsOpen, closeDialog} = props

  

 

  return (
    <Dialog open={dialogIsOpen}>
      <DialogTitle>Add New Item</DialogTitle>
      <DialogContent>
        <Stack spacing={3}>

          <TextField id="itemTitle" label='title' sx={{ mt: 1}}/>

          <TagsMultiSelect />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>CANCEL</Button>
      </DialogActions>
    </Dialog>
  )
  

}