import { useEffect, useState } from "react"
import { Button, TextField, Dialog, DialogTitle,Stack, 
  DialogContent,DialogActions,  } from "@mui/material"
import TagsMultiSelect from "./TagsMultiSelect"
import SectionsInupt from "./SectionsInput";

import ItemTitleInput from "./ItemTitleInput";
import axios from "axios";

export default function AddItemDialog(props: any){
  const {dialogIsOpen, closeDialog} = props
  const [item, setItem] = useState({id: ''})

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect( () => {

    if(dialogIsOpen){
      try {
        axios.post('http://localhost:5000/api/items', {title: ''})
        .then((res) => {
          setItem(res.data.item)
          try {
            axios.post('http://localhost:5000/api/sections', 
            {sectiontype: "63b2503c49220f42d9fc17d9", content: '', itemId: res.data.item.id, order: 1})
            .then((res) => {


              console.log('res.data.item',res.data.item)
              setItem(res.data.item)
            })
            .catch((error) => {
              console.log(error)
            })
          } catch (e) {
            console.log(e)
          }
          setIsSubmitting(false)
        })
        .catch((e) => {
          console.log(e)
          setIsSubmitting(false)
        })
      } catch (e) {
        console.log(e)
        setIsSubmitting(false)
      }
    }

   
  },[dialogIsOpen])

 

  

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
          <SectionsInupt item={item} setItem={(item: any) => handleSetItem(item)} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>CANCEL</Button>
      </DialogActions>
    </Dialog>
  )
  

}