import {  useMemo, useState } from "react"
import { Button,Stack,  DialogContent,DialogActions, Typography,  } from "@mui/material"
import TagsMultiSelect from "./TagsMultiSelect"
import SectionsInupt from "./SectionsInput";
import { useSession} from "next-auth/react";

import ItemTitleInput from "./ItemTitleInput";
import axios from "axios";
import DraggableDialog from "../ui/DraggableDialog";

export default function AddItemDialog(props: any){

  const { data: session, status } = useSession()

  const loading = status === "loading"


  const {dialogIsOpen, closeDialog} = props
  const [item, setItem] = useState({id: ''})

  const [isSubmitting, setIsSubmitting] = useState(false)
  

  useMemo( () => {

   

    if(!item.id){

      if(dialogIsOpen && session){
        try {
          axios.post('http://localhost:5000/api/items', {title: ''})
          .then((res) => {
            setItem(res.data.item)
            try {
              axios.post('http://localhost:5000/api/sections', 
              {sectiontype: "63b2503c49220f42d9fc17d9", content: '', itemId: res.data.item.id, order: 1})
              .then((res) => {                
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
    }
   
  },[dialogIsOpen, session, item])  

  function handleSetItem(item: any){ 
    setItem(item)
  }

  return (

    <DraggableDialog 
      dialogIsOpen={dialogIsOpen}
      ariaLabel="add-item"
      title="ADD ITEM"
    >
      { loading && ( <DialogContent>Loading ...</DialogContent>) }
      {
        (!loading && !session ) && 
        ( <Typography sx={{m: 3}}>Permission Denied</Typography> )
      }
      {
        (!loading && session) && (
           <>
             <DialogContent>
              <Stack spacing={3}>
                <ItemTitleInput item={item} setItem={(item: any) => handleSetItem(item)}/>
                <TagsMultiSelect  item={item} setItem={(item: any) => handleSetItem(item)} />         
                <SectionsInupt item={item} setItem={(item: any) => handleSetItem(item)} />
              </Stack>
            </DialogContent>      
           </>
         )
       }
      <DialogActions>
        <Button onClick={closeDialog} disabled={!session}>SAVE</Button>
        <Button onClick={closeDialog}>CANCEL</Button>
      </DialogActions>
    </DraggableDialog>  
  )
}