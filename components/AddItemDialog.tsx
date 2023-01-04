import { useState } from "react"
import { Button, IconButton, FormControl, InputLabel, Select, TextField, Dialog, DialogTitle, OutlinedInput, Stack, Box, InputAdornment,
  DialogContent,DialogActions, SelectChangeEvent, MenuItem, useTheme } from "@mui/material"
import TagsMultiSelect from "./TagsMultiSelect"
import AddIcon from '@mui/icons-material/Add';
import SelctionsInupt from "./SectionsInput";


export default function AddItemDialog(props: any){

  const {dialogIsOpen, closeDialog} = props

  

  return (
    <Dialog open={dialogIsOpen}>
      <DialogTitle>Add New Item</DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <TextField id="itemTitle" label='Title' sx={{ mt: 1}}/>
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