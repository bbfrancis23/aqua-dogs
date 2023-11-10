import { useContext, useEffect, useState } from "react"
import { Button, DialogActions, DialogContent, Stack} from "@mui/material"
import { useSnackbar } from "notistack"
import axios from "axios"
import { Item, ItemContext, EditItemTitleForm, ArchiveItemForm, ItemTitle } from "@/react/item"
import { Section, CodeSection, CreateSectionForm, TextSection } from "@/react/section"
import { ProjectContext } from "@/react/project"
import { MemberContext } from "@/react/members"
import Comments from "@/react/comments"
import {DraggableDialog } from "@/fx/ui"

export interface MemberItemDialogProps {
  dialogIsOpen: boolean
  closeDialog: () => void
  itemId: string | null
}

const dummyItem = { title: 'undefined item title', id: '0', owners: ['0']}

const MemberItemDialog = ({dialogIsOpen, closeDialog, itemId}: MemberItemDialogProps) => {

  const {project} = useContext(ProjectContext)
  const {member} = useContext(MemberContext)
  const {enqueueSnackbar} = useSnackbar()

  const [itemIsLoading, setItemIsLoading] = useState<boolean>(true)
  const [item, setItem] = useState<Item>(dummyItem)

  useEffect(() => {

    if(!itemId) return
    if(dialogIsOpen === false) return

    axios.get(`/api/members/projects/${project.id}/items/${itemId}`)
      .then((response) => {
        setItem(response.data.item)
        setItemIsLoading(false)
      }) .catch((error) => {
        enqueueSnackbar(error.response.data.message, {variant: "error"})
      })
  }, [project.id, itemId, dialogIsOpen, enqueueSnackbar])


  const [showForm, setShowForm] = useState<boolean>(false)

  const endDialog = () => {
    closeDialog()
    setItemIsLoading(true)
    setShowForm(false)
    setItem(dummyItem)
  }

  const getItemTitle = () => {
    return showForm ? <EditItemTitleForm closeForm={() => setShowForm(false)}/>
      : <ItemTitle itemIsLoading={itemIsLoading} setShowForm={setShowForm} />
  }

  const draggableDialogProps = {
    dialogIsOpen,
    ariaLabel: "item-dialog",
    title: getItemTitle(),
  }


  return (
    <>
      { itemIsLoading === false && (
        <ItemContext.Provider value={{item, setItem}}>
          <DraggableDialog {...draggableDialogProps} >
            <DialogContent sx={{ width: {xs: 'auto', md: '600px'} }}>
              <Stack spacing={3} alignItems={'flex-start'} sx={{ width: '100%'}}>
                { item?.sections?.map( ( s: Section) => {
                  if(s.sectiontype === "63b88d18379a4f30bab59bad"){
                    return ( <CodeSection section={s} key={s.id}/> )
                  }
                  return ( <TextSection section={s} key={s.id} />)
                })}
                <CreateSectionForm />
                <Comments />
                <ArchiveItemForm />
              </Stack>
            </DialogContent>
            <DialogActions disableSpacing={false}>
              <Button onClick={() => endDialog()} color="inherit" variant="outlined">Done</Button>
            </DialogActions>
          </DraggableDialog>
        </ItemContext.Provider>
      ) }
    </>
  )
}

export default MemberItemDialog

// QA Brian Francis 10-28-23