import { Item } from "@/interfaces/ItemInterface"

import {findProjectItems} from "@/mongo/controls/member/project/items/findProjectItems"

import { getSession, useSession } from "next-auth/react"

import { findMember } from "@/mongo/controls/member/memberControls"

import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { Section } from "@/interfaces/SectionInterface";
import dynamic from "next/dynamic";
import InfoPageLayout from "@/ui/InfoPageLayout";
import { findItem } from "@/mongo/controls/member/project/items/findItem";
import { ProjectMemberAvatar } from "@/components/members/projects/ProjectMemberAvatar";
import Permission, { PermissionCodes } from "@/ui/PermissionComponent";
import { Member } from "@/interfaces/MemberInterface";
import CreateCommentForm from "@/components/items/forms/CreateCommentForm";
import { useEffect, useState } from "react";
import { set } from "mongoose";
const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  {ssr: false}
)
export interface PublicItemPageProps {
  item: Item
  openAuthDialog: () => void
}


export const PublicItemPage = ( props: PublicItemPageProps) => {


  const {item, openAuthDialog} = props

  console.log(props)


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

export default PublicItemPage

export const getStaticPaths = async () => {
  let items: Item[] = await findProjectItems('64b6bc0a1b836981ba0c4cc5')


  const paths = items.map( (i: any) =>
    ({params: {
      dirId: `${i.title.toLocaleLowerCase().trim().replace(/ /g, '-')}`,
      itemId: i._id
    }}))

  return {paths, fallback: false}

}

export const getStaticProps = async ({params}: any) => {

  // let item = {}
  const {dirId, itemId} = params
  // const item = await getItem(itemId)
  const item = await findItem(itemId)

  return {props: {item}}

}

// TODO: replace getItem with findItem