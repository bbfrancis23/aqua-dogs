import { CodeSection }
  from "@/components/members/projects/boards/columns/items/sections/CodeSection"
import CreateSectionForm
  from "@/components/members/projects/boards/columns/items/sections/forms/CreateSectionForm"
import { Item, ItemContext } from "@/interfaces/ItemInterface"
import { ProjectContext } from "@/interfaces/ProjectInterface"
import { Section } from "@/interfaces/SectionInterface"
import DraggableDialog from "@/ui/DraggableDialog"
import { Button, DialogActions, DialogContent, Skeleton, Stack, Typography } from "@mui/material"
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import ArchiveItemForm from "../ArchiveItemForm"
import { MemberContext } from "@/interfaces/MemberInterface"
import { TextSection }
  from "@/components/members/projects/boards/columns/items/sections/TextSection"
import Permission, { NoPermission, PermissionCodes } from "@/ui/PermissionComponent"
import EditItemTitleForm
  from "@/components/members/projects/boards/columns/items/forms/EditItemTitleForm"
import { it } from "node:test"
import { set } from "mongoose"
import SectionStub from "@/components/members/projects/boards/columns/items/sections/SectionStub"


export interface MemberItemDialogProps {
  dialogIsOpen: boolean
  closeDialog: () => void
  itemId: string | null
}

const MemberItemDialog = (props: MemberItemDialogProps) => {

  const {dialogIsOpen, closeDialog} = props

  const {project} = useContext(ProjectContext)
  const {member} = useContext(MemberContext)

  const [itemIsLoading, setItemIsLoading] = useState<boolean>(true)


  const [item, setItem] = useState<Item>({
    title: 'undefined item title',
    id: '0',
    owners: ['0']
  });

  useEffect(() => {


    if(!props.itemId) return

    axios.get(`/api/members/projects/${project.id}/items/${props.itemId}`)
      .then((response) => {
        setItem(response.data.item)
        setItemIsLoading(false)
      })
      .catch((error) => {
        console.error(error);
      });
  }, [project.id, props.itemId, itemIsLoading]);


  const [showForm, setShowForm] = useState<boolean>(false)

  const ItemTitle = (
    <>
      <Permission code={PermissionCodes.ITEM_OWNER} item={item} member={member}>
        <Typography variant={'h1'}
          sx={{p: 5, pl: 2, fontSize: {xs: '2rem', sm: '3rem'}, width: '100%' }}
          onClick={() => setShowForm(true)} noWrap>
          {itemIsLoading ? <Skeleton /> : item.title}
        </Typography>
      </ Permission>
      <NoPermission code={PermissionCodes.ITEM_OWNER} item={item} member={member}>
        <Typography variant={'h1'}
          sx={{p: 5, pl: 2, fontSize: {xs: '2rem', sm: '3rem'}, width: '100%' }}>
          {itemIsLoading ? <Skeleton /> : item.title}
        </Typography>
      </NoPermission>

    </>
  )

  const EditItemTitle = ( <EditItemTitleForm closeForm={() => setShowForm(false)}/> )

  const handleCloseDialog = () => {
    closeDialog()
    setShowForm(false)
    setItemIsLoading(true)
    setItem({
      title: 'undefined item title',
      id: '0',
      owners: ['0']
    })

  }

  return (
    <ItemContext.Provider value={{item, setItem}}>
      <DraggableDialog dialogIsOpen={dialogIsOpen} ariaLabel="item-dialog"
        title={ showForm ? EditItemTitle : ItemTitle } >
        <DialogContent >
          {
            itemIsLoading && (
              <SectionStub />
            )
          }
          { !itemIsLoading &&
            (
              <Stack spacing={3} alignItems={'flex-start'}
                sx={{ width: '100%'}}>
                { item?.sections?.map( ( s: Section) => {
                  if(s.sectiontype === "63b88d18379a4f30bab59bad"){
                    return (
                      <CodeSection project={project} section={s} member={member} key={s.id}/>
                    )
                  }
                  return ( <TextSection project={project} section={s} member={member} key={s.id} />)
                })}
                <CreateSectionForm member={member} />
                <ArchiveItemForm />
              </Stack>
            )
          }

        </DialogContent>
        <DialogActions disableSpacing={false}>
          <Button
            onClick={() => handleCloseDialog()} color="inherit" variant="outlined"> Done </Button>
        </DialogActions>
      </DraggableDialog>
    </ItemContext.Provider>
  )
}

export default MemberItemDialog