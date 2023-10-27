import { useSession } from "next-auth/react"

import { useContext, useEffect, useState } from "react"
import { Box, Button, Divider, Stack, Typography } from "@mui/material"


import { Member, ProjectMemberAvatar } from "@/react/members"
import { PermissionCodes } from "@/fx/ui"

import { CreateCommentForm, ItemContext } from "@/react/item/"

import { AppContext, AppDialogs, DialogActions } from "@/react/app/"

import { Comment } from "@/react/comments/comment-types"
import { CodeComment } from "./components/CodeComment"
import { TextComment } from "./components/TextComment"

const Comments = () => {

  const {data: session} = useSession()
  const [member, setMember] = useState<Member | undefined>(undefined)
  const {item} = useContext(ItemContext)

  const { dialogActions} = useContext(AppContext)

  const handleOpenAuthDialog = () => {
    dialogActions({type: DialogActions.Open, dialog: AppDialogs.Auth})
  }


  useEffect(() => {

    if(session && session.user){
      const castSession = session.user as any
      setMember({id: castSession.id, name: castSession.name, email: castSession.email})
    }
  }, [session])

  // console.log(item)

  return (
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
        { member && (
          <Stack spacing={3} direction={'row'} sx={{ width: '100%'}}>
            <Box>
              <ProjectMemberAvatar type={PermissionCodes.PROJECT_MEMBER} member={member} />
            </Box>
            <CreateCommentForm member={member} />
          </Stack>
        ) }
        { ! member && (
          <>
            <Typography variant={'body1'} >Please Login or Register to comment</Typography>
            <Button variant={'contained'} onClick={() => handleOpenAuthDialog()} >
          Authenticate
            </Button>
          </>
        ) }

      </Stack>


    </Box>
  )
}

export default Comments