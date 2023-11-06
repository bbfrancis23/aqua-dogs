import { useSession } from "next-auth/react"
import { useContext, useEffect, useState } from "react"
import { Box, Button, Divider, Stack, Typography } from "@mui/material"
import { Member, ProjectMemberAvatar } from "@/react/members"
import { CreateCommentForm, ItemContext } from "@/react/item/"
import { AppContext, AppDialogs, DialogActions } from "@/react/app/"
import { Comment, CodeComment, TextComment } from "@/react/comments"
import { PermissionCodes } from "@/fx/ui"

const Comments = () => {

  const {data: session} = useSession()
  const [member, setMember] = useState<Member | undefined>(undefined)
  const {item} = useContext(ItemContext)

  const { dialogActions} = useContext(AppContext)

  const openAuthDialog = () => dialogActions({type: DialogActions.Open, dialog: AppDialogs.Auth})

  useEffect(() => { if(session && session.user) setMember(session.user as Member) }, [session])

  return (
    <Box sx={{width: '100%'}}>
      <Divider sx={{pb: 3}}>Comments</Divider>
      <Stack spacing={3} alignItems={'flex-start'} sx={{ width: '100%'}}>
        { item?.comments?.map( ( c: Comment) => {
          if(c.sectiontype === "63b88d18379a4f30bab59bad"){
            return ( <CodeComment comment={c} key={c.id}/> )
          }
          return ( <TextComment comment={c} key={c.id} /> )
        })}
        { member && (
          <Stack spacing={3} direction={'row'} sx={{ width: '100%'}}>
            <Box>
              <ProjectMemberAvatar type={PermissionCodes.PROJECT_MEMBER} member={member} />
            </Box>
            <CreateCommentForm />
          </Stack>
        ) }
        { ! member && (
          <>
            <Typography variant={'body1'} >Please Login or Register to comment</Typography>
            <Button variant={'contained'} onClick={() => openAuthDialog()} >Authenticate</Button>
          </>
        ) }
      </Stack>
    </Box>
  )
}

export default Comments

// QA Brian Francis 10-27-23