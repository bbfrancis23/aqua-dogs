import { useContext, useEffect, useState } from "react"

import { Box, Button, DialogActions, DialogContent, Divider, Skeleton, Stack,
  Typography } from "@mui/material"
import { useSnackbar } from "notistack"

import axios from "axios"

import DraggableDialog from "@/ui/DraggableDialog"
import Permission, { NoPermission, PermissionCodes } from "fx/ui/PermissionComponent"

import { Item } from "@/react/item/item-types"
import { Section } from "@/react/section/section-types"
import { ProjectContext } from "@/interfaces/ProjectInterface"
import { MemberContext } from "@/react/Member/member-types"

import CodeSection from "@/components/items/sections/CodeSection"
import CreateSectionForm from "@/components/items/forms/CreateSectionForm"
import { TextSection } from "@/components/items/sections/TextSection"
import EditItemTitleForm from "@/components/items/forms/EditItemTitleForm"
import ArchiveItemForm from "@/components/items/forms/ArchiveItemForm"
import styled from "@emotion/styled"
import { ProjectMemberAvatar } from "@/react/Member/components/ProjectMemberAvatar"
import CreateCommentForm from "../../../react/item/components/CreateCommentForm"

import { Comment } from "@/interfaces/CommentInterface"
import { TextComment } from "../comments/TextComment"
import { CodeComment } from "../comments/CodeComment"
import { ItemContext } from "@/react/item/ItemContext"

export interface MemberItemDialogProps {
  dialogIsOpen: boolean
  closeDialog: () => void
  itemId: string | null
}

const dummyItem = { title: 'undefined item title', id: '0', owners: ['0']}

const ItemTitleText = styled(Typography)(() => ({ padding: 5, paddingLeft: 2, width: '100%',}))

const MemberItemDialog = (props: MemberItemDialogProps) => {

  const {dialogIsOpen, closeDialog, itemId} = props
  const {project} = useContext(ProjectContext)
  const {member} = useContext(MemberContext)

  const [itemIsLoading, setItemIsLoading] = useState<boolean>(true)
  const [item, setItem] = useState<Item>(dummyItem);

  const {enqueueSnackbar} = useSnackbar()

  useEffect(() => {

    if(!itemId) return
    if(dialogIsOpen === false) return

    axios.get(`/api/members/projects/${project.id}/items/${itemId}`)
      .then((response) => {
        setItem(response.data.item)
        setItemIsLoading(false)
      })
      .catch((error) => {
        enqueueSnackbar(error.response.data.message, {variant: "error"})
      });
  }, [project.id, itemId, dialogIsOpen, enqueueSnackbar]);


  const [showForm, setShowForm] = useState<boolean>(false)

  const ItemTitle = (
    <>
      <Permission code={PermissionCodes.ITEM_OWNER} item={item} member={member}>
        <ItemTitleText variant={'h1'} sx={{fontSize: {xs: '2rem', sm: '3rem'}}}
          onClick={() => setShowForm(true)} noWrap>
          {itemIsLoading ? <Skeleton /> : item?.title}
        </ ItemTitleText>
      </ Permission>
      <NoPermission code={PermissionCodes.ITEM_OWNER} item={item} member={member}>
        <ItemTitleText variant={'h1'} sx={{fontSize: {xs: '2rem', sm: '3rem'}}} >
          {itemIsLoading ? <Skeleton /> : item?.title}
        </ItemTitleText>
      </NoPermission>
    </>
  )

  const EditItemTitle = ( <EditItemTitleForm closeForm={() => setShowForm(false)}/> )

  const handleCloseDialog = () => {
    closeDialog()
    setItemIsLoading(true)
    setShowForm(false)
    setItem(dummyItem)
  }

  return (
    <>
      { itemIsLoading === false && (
        <ItemContext.Provider value={{item, setItem}}>
          <DraggableDialog dialogIsOpen={dialogIsOpen} ariaLabel="item-dialog"
            title={ showForm ? EditItemTitle : ItemTitle } >
            <DialogContent >
              <Stack spacing={3} alignItems={'flex-start'} sx={{ width: '100%'}}>
                { item?.sections?.map( ( s: Section) => {
                  if(s.sectiontype === "63b88d18379a4f30bab59bad"){
                    return (
                      <CodeSection project={project} section={s} member={member} key={s.id}/>
                    )
                  }
                  return ( <TextSection project={project} section={s} member={member} key={s.id} />)
                })}
                <CreateSectionForm member={member} />
                <Box sx={{width: '100%'}}>
                  <Divider sx={{pb: 3}}>Comments</Divider>
                  <Stack spacing={3} alignItems={'flex-start'} sx={{ width: '100%'}}>
                    { item?.comments?.map( ( c: Comment) => {

                      if(c.sectiontype === "63b88d18379a4f30bab59bad"){
                        return (
                          <CodeComment comment={c} key={c.id}/>
                        )
                      }
                      return (
                        <TextComment comment={c} key={c.id} />
                      )
                    })}
                    <Stack spacing={3} direction={'row'} sx={{ width: '100%'}}>
                      <Box>
                        <ProjectMemberAvatar
                          type={PermissionCodes.PROJECT_MEMBER} member={member} />
                      </Box>
                      <CreateCommentForm member={member} />
                    </Stack>
                  </Stack>
                </Box>
                <ArchiveItemForm />
              </Stack>
            </DialogContent>
            <DialogActions disableSpacing={false}>
              <Button onClick={() => handleCloseDialog()} color="inherit" variant="outlined">
                Done
              </Button>
            </DialogActions>
          </DraggableDialog>
        </ItemContext.Provider>
      ) }
    </>
  )
}

export default MemberItemDialog