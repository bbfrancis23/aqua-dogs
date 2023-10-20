import { Member } from "@/react/members/member-types"
import { Project } from "@/react/project/"
import { GetServerSideProps, Redirect } from "next"

import dynamic from "next/dynamic";

import { getSession, useSession } from "next-auth/react"

import { findMember } from "@/mongo/controls/member/memberControls"

import { findProject } from "@/mongo/controls/member/project/projectControls"
import { PermissionCodes, permission } from "fx/ui/PermissionComponent"

import { findItem } from "@/mongo/controls/member/project/items/findItem"
import findMemberPublicBoard from "@/mongo/controls/member/project/board/findMemberPublicBoard"
import { Board } from "@/react/board/board-types"
import InfoPageLayout from "fx/ui/InfoPageLayout"
import { Box, Button, Divider, Stack, Typography } from "@mui/material"
import { Section } from "@/react/section/section-types"
import { Item } from "@/react/item/item-types";
import { useEffect, useState } from "react";
import { ProjectMemberAvatar } from "@/react/members/components/ProjectMemberAvatar";
import CreateCommentForm from "@/react/item/components/CreateCommentForm";

const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  {ssr: false}
)

export interface PublicMemberItemPageProps {
  item: Item
  openAuthDialog?: () => void
}
const unAuthRedirect: Redirect = {destination: "/", permanent: false}

export const getServerSideProps:

GetServerSideProps<PublicMemberItemPageProps> = async(context) => {

  if(!context.query.boardId) return {redirect: unAuthRedirect}
  if( typeof context.query.boardId !== "string" ) return {redirect: unAuthRedirect}

  const board: Board = await findMemberPublicBoard(context.query.boardId)

  if(!board) return {redirect: unAuthRedirect}

  if( typeof context.query.itemId !== "string" ) return {redirect: unAuthRedirect}

  const item = await findItem(context?.query?.itemId)

  return {props: { item}}


}

export const PublicMemberItemPage = ( props: any) => {


  const {item, openAuthDialog} = props

  const {data: session} = useSession()

  const [member, setMember] = useState<Member | undefined>(undefined)

  useEffect(() => {

    if(session && session.user){

      const castSession = session.user as any

      setMember({id: castSession.id, name: castSession.name, email: castSession.email})

    }

  }, [session])

  return (


    <InfoPageLayout title={ <Typography variant={'h1'}
      sx={{p: 5, pl: 2, fontSize: {xs: '2rem', sm: '3rem'}, width: '100%' }}>
      {item.title}
    </Typography> }>
      <Stack spacing={3} alignItems={'flex-start'} sx={{p: 10, pt: 5, width: '100%'}}>
        { item.sections?.map( ( s: Section) => {
          if(s.sectiontype === "63b88d18379a4f30bab59bad"){
            return (
              <CodeEditor
                key={s.id}
                value={s.content}
                language="jsx"
                readOnly
                padding={15}
                style={{
                  width: '100%',
                  fontSize: 12,
                  backgroundColor: "#f5f5f5",
                  fontFamily:
                            "ui-monospace,SF Mono,Consolas,Liberation Mono,Menlo,monospace"
                }}
              />
            )
          }
          return ( <Typography key={s.id}>
            {s.content}
          </Typography>)
        })}
        <Box sx={{width: '100%'}}>
          <Divider sx={{pb: 3}}>Comments</Divider>

          {
            member && (
              <Stack spacing={3} direction={'row'} sx={{ width: '100%'}}>
                <Box>
                  <ProjectMemberAvatar
                    type={PermissionCodes.PROJECT_MEMBER} member={member} />
                </Box>
                <CreateCommentForm member={member} />
              </Stack>
            )
          }
          {
            ! member && (
              <>
                <Typography variant={'body1'} >Please Login or Register to comment</Typography>
                <Button variant={'contained'}
                  onClick={() => openAuthDialog()} >Authenticate</Button>
              </>
            )
          }

        </Box>
      </Stack>
    </InfoPageLayout>
  )
}

export default PublicMemberItemPage

// TODO: replace getItem with findItem