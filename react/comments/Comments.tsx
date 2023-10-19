import { useSession } from "next-auth/react";

import { useContext, useEffect, useState } from "react";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";


import { Member, ProjectMemberAvatar } from "@/react/Member/"
import { PermissionCodes } from "@/fx/ui";

import { CreateCommentForm } from "@/react/item/"

import { AppContext, AppDialogs, DialogActions, WebsiteBoards } from "@/react/app/";

const Comments = () => {

  const {data: session} = useSession()
  const [member, setMember] = useState<Member | undefined>(undefined)

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

  return (
    <Box sx={{width: '100%'}}>
      <Divider sx={{pb: 3}}>Comments</Divider>
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
    </Box>
  )
}

export default Comments