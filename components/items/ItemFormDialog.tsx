import {useMemo, useState} from "react"
import {useSession} from "next-auth/react"

import {Button, Stack, DialogContent, DialogActions, Typography,} from "@mui/material"

import axios from "axios"
import {useSnackbar} from "notistack"
import SectionsInupt from "../SectionsInput"
import ItemTitleInput from "../ItemTitleInput"
import DraggableDialog from "../../ui/DraggableDialog"
import { Item } from "../../interfaces/ItemInterface"
import FormModes from "../../enums/FormModes"
import { Org } from "../../interfaces/OrgInterface"
import { Member } from "../../interfaces/MemberInterface"
import { Project } from "@/interfaces/ProjectInterface"
import { Board } from "@/interfaces/BoardInterface"
import { Column } from "@/interfaces/Column"

export interface ItemFormDialogProps{
  dialogIsOpen: boolean;
  closeDialog: () => void;
  mode: FormModes;
  editItem ?: Item;
  updateEditedItem? : (i: Item) => void;
  tagIds ?: string[];
  org ?: Org;
  member ?: Member;
  project: Project;
  board: Board;
  column: Column;
}

export default function ItemFormDialog(props: ItemFormDialogProps){

  const {enqueueSnackbar} = useSnackbar()
  const {data: session, status} = useSession()

  const loading = status === "loading"


  const {dialogIsOpen, closeDialog, mode, editItem, updateEditedItem, tagIds,
    org, member, project, board, column} = props
  const [item, setItem] = useState<any>()


  useMemo(() => {

    if(mode === "EDIT"){
      setItem(editItem)
    }
  }, [editItem, mode])


  useMemo( () => {

    if(!item){

      if(dialogIsOpen && session && mode === "ADD"){
        try {
          axios.post(`/api/projects/${project.id}/boards/${board.id}/columns/${column.id}/items`,
            {scope: 'privare'})
            .then((res) => {

              setItem(res.data.item)
              try {

                axios.post("/api/sections",
                  {
                    sectiontype: "63b2503c49220f42d9fc17d9",
                    content: "", itemId: res.data.item.id, order: 1})
                  .then((sectionsRes) => {

                    enqueueSnackbar("Created a new Item", {variant: "success"})
                    setItem(sectionsRes.data.item)
                  })
                  .catch((e:any) => {
                    enqueueSnackbar(e, {variant: "error"})
                  })
              } catch (e:any) {
                enqueueSnackbar(e, {variant: "error"})
              }
            })
            .catch((e:any) => {
              enqueueSnackbar(e, {variant: "error"})
            })
        } catch (e:any) {
          enqueueSnackbar(e, {variant: "error"})
        }
      }
    }

  }, [item, dialogIsOpen, session, mode, project.id, board.id, column.id, enqueueSnackbar])


  const handleSetItem = (i: any) => {

    if(mode === "EDIT" && updateEditedItem){

      updateEditedItem(i)

    }else if(mode === 'ADD'){
      setItem(i)
    }

  }

  const handleCloseDialog = async() => {
    console.log('close dialog')

    closeDialog()
    await setItem(undefined)
    console.log(item)
  }

  return (
    <DraggableDialog dialogIsOpen={dialogIsOpen} ariaLabel="add-item" title={`${mode} ITEM`}
      fullWidth={true} >
      <>
        {
          (loading || item?.sections?.length === 0)
            && ( <DialogContent>Loading ...</DialogContent>) }
        {
          (!loading && !session ) &&
            ( <Typography sx={{m: 3}}>Permission Denied</Typography> )
        }
        {
          (!loading && session && item?.sections?.length > 0) && (
            <>
              <DialogContent >
                <Stack spacing={3}>
                  <ItemTitleInput
                    item={item}
                    setItem={(i: any) => handleSetItem(i)}
                  />

                  <SectionsInupt item={item} setItem={(i: any) => handleSetItem(i)} />
                </Stack>
              </DialogContent>
            </>
          )
        }
      </>

      <DialogActions>

        <Button onClick={handleCloseDialog} >CLOSE</Button>
      </DialogActions>
    </DraggableDialog>
  )
}


