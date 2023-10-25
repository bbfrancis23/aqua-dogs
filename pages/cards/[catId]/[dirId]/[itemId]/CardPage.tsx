import { ParsedUrlQuery } from "querystring"

import { GetStaticPaths, GetStaticProps } from "next"

import { Box, Stack, Typography} from "@mui/material"

import { findItem } from "@/mongo/controls/member/project/items/findItem"
import {findProjectItems} from "@/mongo/controls/member/project/items/findProjectItems"
import { findProjectBoards } from "@/mongo/controls/member/project/projectControls"

import { WebsiteBoards } from "@/react/app/"
import { Item, getItemDirectory } from "@/react/item/"
import { Section } from "@/react/section/"
import { Board, getBoardDirectory } from "@/react/board/"
import Comments from "@/react/comments"

import { WEBSITE_PROJECT_ID } from "pages/HomePage"
import { BoardDrawer, InfoPageLayout, FxCodeEditor } from "@/fx/ui"
import Head from "next/head"

export interface PublicCardPage {
  item: Item,
  dirId: string,
  catTitle: string,
  colTitle: string,
  board: Board | undefined,
}

type PublicCardPageBackend = Omit<PublicCardPage, "openAuthDialog">

export interface PublicCardPageParams extends ParsedUrlQuery{
  dirId: string
  itemId: string
}

export const getStaticPaths: GetStaticPaths<PublicCardPageParams> = async () => {

  let items: Item[] = await findProjectItems(WEBSITE_PROJECT_ID)

  const paths = items.map( (i: any) =>
    ({params: { catId: getBoardDirectory(i.category), dirId: getItemDirectory(i), itemId: i._id }}))

  return {paths, fallback: false}
}

export const getStaticProps: GetStaticProps<PublicCardPageBackend> = async (context) => {

  const {catId, dirId, itemId} = context.params as PublicCardPageParams

  const item = await findItem(itemId)

  let boards: Board[] = await findProjectBoards(WEBSITE_PROJECT_ID)

  const currentBoardStub = WebsiteBoards.find( (pb: any) => pb.dirId === catId)
  const currentBoard = boards.find( (b: Board) => b.id === currentBoardStub.id)

  let colTitle = ''
  currentBoard?.columns.forEach( (c: any) => {
    const currentItem = c.items.find( (i: any) => i.id === itemId)

    if(currentItem){
      colTitle = c.title
    }
  })

  const catTitle = WebsiteBoards.find( (pb: any) => pb.dirId === catId)?.title

  return {props: {catTitle, colTitle, dirId, item, board: currentBoard}}

}

const PageTitle = ({children}: any) => (
  <Typography variant={'h1'} sx={{p: 5, fontSize: {xs: '2rem', sm: '3rem'}, width: '100%' }}>
    {children}
  </Typography>
)

export const Page = ({catTitle, colTitle, item, board}: PublicCardPage) => (
  <>
    <Head>
      <title>Strategy Fx - {item.title}</title>
    </Head>
    { board && ( <BoardDrawer board={board} /> ) }
    <Box sx={{ml: {xs: 0, sm: '240px'} }}>
      <InfoPageLayout
        title={ <PageTitle>{catTitle} : {colTitle} <br /> {item.title} </PageTitle> } >
        <Stack spacing={3} alignItems={'flex-start'} sx={{p: 10, pt: 5, width: '100%'}}>
          { item.sections?.map( ( s: Section) => {
            if(s.sectiontype === "63b88d18379a4f30bab59bad"){
              return ( <FxCodeEditor section={s} key={s.id}/> )
            }
            return ( <Typography key={s.id}>{s.content}</Typography>)
          })}
          <Comments />
        </Stack>
      </InfoPageLayout>
    </Box>
  </>
)
export default Page

