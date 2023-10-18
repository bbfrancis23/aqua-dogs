import { useEffect, useState } from "react";
import { ParsedUrlQuery } from "querystring";

import { useSession } from "next-auth/react"
import dynamic from "next/dynamic";
import { GetStaticPaths, GetStaticProps } from "next";

import { Box, Button, Divider, Stack, Typography } from "@mui/material";

import { publicBoards } from "@/react/app/";


import { findItem } from "@/mongo/controls/member/project/items/findItem";
import {findProjectItems} from "@/mongo/controls/member/project/items/findProjectItems"
import { findProjectBoards } from "@/mongo/controls/member/project/old-findProjectBoards"


import {InfoPageLayout, PermissionCodes} from "fx/ui/"

import { Item, CreateCommentForm } from "@/react/item/"
import { Section } from "@/react/section/"
import { Member, ProjectMemberAvatar } from "@/react/Member/"
import { Board, getBoardDirectory } from "@/react/board/"

import { WEBSITE_PROJECT_ID } from "pages/HomePage"


/********* Interfaces Globals and Helpers **********/

const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  {ssr: false}
)
export interface PublicCardPage {
  item: Item
  dirId: string,
  catTitle: string,
  colTitle: string,
  board: Board | undefined,
  openAuthDialog: () => void
}

type PublicCardPageBackend = Omit<PublicCardPage, "openAuthDialog">

export interface PublicCardPageParams extends ParsedUrlQuery{
  dirId: string
  itemId: string
}

export const getPublicCardDirectory = (item: Item): string => (

  item.title.toLocaleLowerCase().trim()
    .replace(/ /g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-',)
)

/********* Backend ***********/

export const getStaticPaths: GetStaticPaths<PublicCardPageParams> = async () => {

  let items: Item[] = await findProjectItems(WEBSITE_PROJECT_ID)


  const paths = items.map( (i: any) =>
    ({params: {
      catId: getBoardDirectory(i.category),
      dirId: getPublicCardDirectory(i),
      itemId: i._id
    }}))

  return {paths, fallback: false}

}

export const getStaticProps: GetStaticProps<PublicCardPageBackend> = async (context) => {

  const {catId, dirId, itemId} = context.params as PublicCardPageParams

  const item = await findItem(itemId)

  let boards: Board[] = await findProjectBoards(WEBSITE_PROJECT_ID)

  const currentBoardStub = publicBoards.find( (pb: any) => pb.dirId === catId)
  const currentBoard = boards.find( (b: Board) => b.id === currentBoardStub.id)

  let colTitle = ''
  currentBoard?.columns.forEach( (c: any) => {
    const currentItem = c.items.find( (i: any) => i.id === itemId)

    if(currentItem){
      colTitle = c.title
    }
  })


  const catTitle = publicBoards.find( (pb: any) => pb.dirId === catId)?.title

  return {props: {catTitle, colTitle, dirId, item, board: currentBoard}}

}


/******** Frontend  ********/

export const Page = ( props: PublicCardPage) => {


  const { catTitle, colTitle, item, board, openAuthDialog} = props

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
      {catTitle} : {colTitle} <br /> {item.title}
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

export default Page

