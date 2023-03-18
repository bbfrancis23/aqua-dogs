import {  useMemo, useState} from "react"
import { Button,Stack,  DialogContent,DialogActions, Typography,  } from "@mui/material"
import TagsMultiSelect from "./TagsMultiSelect"
import SectionsInupt from "./SectionsInput";
import { useSession} from "next-auth/react";

import ItemTitleInput from "./ItemTitleInput";
import axios from "axios";
import DraggableDialog from "../ui/DraggableDialog";

import { useSnackbar } from 'notistack';

export default function ItemFormDialog(props: any){

  const { enqueueSnackbar } = useSnackbar();
  const { data: session, status } = useSession()

  const loading = status === "loading"

  const {dialogIsOpen, closeDialog, mode, editItem, updateEditedItem} = props
  const [item, setItem] = useState<any>({id: ''})

  // TODO ADD Submitting disable   
  const [isSubmitting, setIsSubmitting] = useState(false)

 
  
  useMemo(() => {

    if(mode === 'EDIT'){
      setItem(editItem)
      //updateEditedItem(editItem)
    }

  },[editItem,mode])


 
  useMemo( () => {

   

    if(!item.id){

     

      if(dialogIsOpen && session && mode === 'ADD'){

        try {
          axios.post(`/api/items`, {title: ''})
          .then((res) => {
            setItem(res.data.item)
            try {
              axios.post(`/api/sections`, 
              {sectiontype: "63b2503c49220f42d9fc17d9", content: '', itemId: res.data.item.id, order: 1})
              .then((res) => {     
                
                enqueueSnackbar('Created a new Item', {variant: 'success'})           
                setItem(res.data.item)
              })
              .catch((e:any) => {
                enqueueSnackbar(e, {variant: 'error'})    
              })
            } catch (e:any) {
              enqueueSnackbar(e, {variant: 'error'})    
            }
            setIsSubmitting(false)
          })
          .catch((e:any) => {
            enqueueSnackbar(e, {variant: 'error'})    
            setIsSubmitting(false)
          })
        } catch (e:any) {
          enqueueSnackbar(e, {variant: 'error'})    
          setIsSubmitting(false)
        }
      }
    }else{
    }
   
  },[dialogIsOpen, session, item, mode, enqueueSnackbar])  


 

  function handleSetItem(item: any){ 
    setItem(item)

    if(mode === 'EDIT'){

      updateEditedItem(item)
    }
  }

  const handleCloseDialog = () => {
    setItem({id: ''})
    closeDialog()
  }
  
  

  return (

    <DraggableDialog 
      dialogIsOpen={dialogIsOpen}
      ariaLabel="add-item"
      title={`${mode} ITEM`}
      fullWidth={true}
    >
      { (loading || item?.sections?.length === 0) && ( <DialogContent>Loading ...</DialogContent>) }
      {
        (!loading && !session ) && 
        ( <Typography sx={{m: 3}}>Permission Denied</Typography> )
      }
      {
        (!loading && session && item?.sections?.length > 0) && (
           <>
             <DialogContent >
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
        <Button onClick={handleCloseDialog} >CLOSE</Button>
      </DialogActions>
    </DraggableDialog>  
  )
}