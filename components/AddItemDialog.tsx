import { useState } from "react"
import { Button, TextField, Dialog, DialogTitle,Stack, 
  DialogContent,DialogActions,  } from "@mui/material"
import TagsMultiSelect from "./TagsMultiSelect"
import SelctionsInupt from "./SectionsInput";

import useSWRMutation from 'swr/mutation'
import axios from "axios";

export default function AddItemDialog(props: any){
  const {dialogIsOpen, closeDialog} = props
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [itemId, setItemId] = useState('')

  const handleTitleBlur = async (e:any) => {
    
    setIsSubmitting(true)

    if(itemId) {
      console.log('Do nothing')
      setIsSubmitting(false)
    }else{
       try {
        axios.post('http://localhost:5000/api/items', {title: e.target.value})
        .then((res) => {
          setItemId(res.data.item.id)
          setIsSubmitting(false)
        })
        .catch((error) => {
          console.log(error)
          setIsSubmitting(false)
        })
      } catch (e) {
        console.log(e)
        setIsSubmitting(false)
      }
    }
   
  }  

  return (
    <Dialog open={dialogIsOpen}>
      <DialogTitle>Add New Item</DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <TextField id="itemTitle" label='Title' sx={{ mt: 1}}  onBlur={(e:any) => handleTitleBlur(e)} disabled={isSubmitting} />                   
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