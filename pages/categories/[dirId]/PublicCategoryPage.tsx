import { Board } from "@/interfaces/BoardInterface"
import { findProjectBoards } from "@/mongo/controls/member/project/old-findProjectBoards"
import {findPublicBoard} from "@/mongo/controls/member/project/board/findPublicBoard"
import { Box, Card, CardContent, CardHeader, Grid, Typography, useTheme } from "@mui/material"
import { publicBoards } from "data/publicBoards";
import { Column } from "@/interfaces/ColumnInterface";
import { Item } from "@/interfaces/ItemInterface";
import Link from "next/link";
import { FxTheme } from "theme/globalTheme";
import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { getPublicCardDirectory } from "../../cards/[catId]/[dirId]/[itemId]/PublicCardPage";

/******** Interfaces Globals and Helpers *********/
 interface PublicCategoryPage { board: Board}

 interface PublicCategoryPageParams extends ParsedUrlQuery{ dirId: string}

 interface PublicBoard extends Board { dirId: string}

export const WEBSITE_BOARD_ID = '64b6bc0a1b836981ba0c4cc5'

export const getPublicBoardDirectory = (board: Board): string => (
  board.title.toLowerCase().replace(/[^a-z]/g, '')
)

export const getPublicCategoryDirectory = (title: string): string => (
  title.toLowerCase().replace(/[^a-z]/g, '')
)

/********* Backend **********/

export const getStaticPaths: GetStaticPaths<PublicCategoryPageParams> = async () => {

  let boards: Board[] = await findProjectBoards(WEBSITE_BOARD_ID)

  const paths = boards.map((b: Board) => ({ params: {dirId: getPublicBoardDirectory(b)}}))

  return {paths, fallback: false}
}

export const getStaticProps: GetStaticProps<PublicCategoryPage> = async (context) => {

  const {dirId}: PublicCategoryPageParams = context.params as PublicCategoryPageParams

  const publicBoard = await publicBoards.find( (pb: PublicBoard) => pb.dirId === dirId)


  const board = await findPublicBoard(publicBoard?.id)

  return {props: {board}}

}

/********** Frontend  ********/
export const Page = ( props: PublicCategoryPage) => {

  const theme: FxTheme = useTheme()


  const {board} = props
  return (
    <>
      <Typography variant="h4" sx={{ pl: 4, pt: 3}}>{board.title}</Typography>
      <Box sx={{ p: theme.defaultPadding}}>
        <Grid container spacing={theme.defaultPadding}>
          { board.columns.map( (c: Column) => (
            <Grid item xs={12} md={6} lg={4} key={c.id}>
              <Card >
                <CardHeader sx={{bgcolor: "secondary.main", color: "secondary.contrastText"}}
                  title={<Typography variant={'h6'} >{c.title}</Typography>} />
                <CardContent sx={{ paddingBottom: "0px"}}>
                  { c.items && c?.items.map( (i: Item) => (
                    <Box sx={{ pb: 1}} key={i.id}>
                      <Typography key={i.id}
                        sx={{pl: 1, '&:hover': {backgroundColor: 'action.hover'}}}>
                        <Link
                        // eslint-disable-next-line max-len
                          href={`/cards/${getPublicBoardDirectory(board)}/${getPublicCardDirectory(i)}/${i.id}`}
                          style={{textDecoration: "none", color: theme.palette.text.primary}} >
                          {i.title}
                        </Link>
                      </Typography>
                    </Box>
                  ))}
                  { !c.items.length && ( <Typography>Comming soon.</Typography>) }
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </ Box>
    </>
  )
}

export default Page

// QA Brian Francis 10-01-23