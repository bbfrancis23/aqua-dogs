import { ParsedUrlQuery } from "querystring";

import { GetStaticPaths, GetStaticProps } from "next";

import { Box, Grid, Typography, useTheme } from "@mui/material"

import { findProjectBoards } from "@/mongo/controls/member/project/old-findProjectBoards"
import {findPublicBoard} from "@/mongo/controls/member/project/board/findPublicBoard"

import { Board, getBoardDirectory } from "@/react/board"
import { WebsiteBoards } from "@/react/app/"
import { Column } from "@/react/column/"
import { Item, getCardDirectory } from "@/react/item"

import { FxTheme } from "@/fx/theme/globalTheme"

import { WEBSITE_PROJECT_ID} from "pages/HomePage"
import { HoverLink, ListCard } from "@/ui/components";

interface CategoryPage { board: Board}
interface CategoryPageParams extends ParsedUrlQuery{ dirId: string}
interface BoardCategory extends Board { dirId: string}

export const getStaticPaths: GetStaticPaths<CategoryPageParams> = async () => {

  let boards: Board[] = await findProjectBoards(WEBSITE_PROJECT_ID)
  const paths = boards.map((b: Board) => ({ params: {dirId: getBoardDirectory(b)}}))
  return {paths, fallback: false}
}

export const getStaticProps: GetStaticProps<CategoryPage> = async (context) => {

  const {dirId}: CategoryPageParams = context.params as CategoryPageParams
  const publicBoard = await WebsiteBoards.find( (pb: BoardCategory) => pb.dirId === dirId)
  const board = await findPublicBoard(publicBoard?.id)
  return {props: {board}}
}

export const Page = ( props: CategoryPage) => {

  const theme: FxTheme = useTheme()
  const {board} = props

  return (
    <>
      <Typography variant="h1" sx={{ pl: 4, pt: 3, fontSize: '2em'}}>{board.title}</Typography>
      <Box sx={{ p: theme.defaultPadding}}>
        <Grid container spacing={theme.defaultPadding}>
          { board.columns.map( (c: Column) => (
            <Grid item xs={12} md={6} lg={4} key={c.id}>
              <ListCard title={c.title}>
                <>
                  { c.items && c?.items.map( (i: Item) => (
                    <HoverLink key={i.id} href={getCardDirectory(board, i)} title={i.title} />
                  ))}
                  { !c.items.length && ( <Typography>Comming soon.</Typography>) }
                </>
              </ListCard>
            </Grid>
          ))}
        </Grid>
      </ Box>
    </>
  )
}

export default Page

// QA Brian Francis 10-15-23