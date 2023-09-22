import { Board } from "@/interfaces/BoardInterface"
import { findProjectBoards } from "@/mongo/controls/member/project/old-findProjectBoards"
import {findPublicBoard} from "@/mongo/controls/member/project/board/findPublicBoard"
import { Box, Card, CardContent, CardHeader, Grid, Typography, useTheme } from "@mui/material"
import { publicBoards } from "data/publicBoards";
import { Column } from "@/interfaces/ColumnInterface";
import { Item } from "@/interfaces/ItemInterface";
import Link from "next/link";
import { FxTheme } from "theme/globalTheme";

export const PublicBoardPage = ( props: {board: Board}) => {

  const theme: FxTheme = useTheme()


  const {board} = props
  return (
    <>
      <Typography variant="h4"
        sx={{ pl: 5, position: 'relative', top: '10px'}}>{board.title}</Typography>
      <Box sx={{ p: theme.defaultPadding}}>

        <Grid container spacing={theme.defaultPadding}>
          { board.columns.map( (c: Column) => (
            <Grid item xs={12} md={6} lg={4} key={c.id}>
              <Card >
                <CardHeader
                  title={<Typography variant={'h6'} >{c.title}</Typography>}
                  sx={{bgcolor: "secondary.main", color: "secondary.contrastText"}}
                />
                <CardContent sx={{ paddingBottom: "0px"}}>
                  { c.items && c?.items.map( (i: Item) => (
                    <Box sx={{ pb: 1}} key={i.id}>
                      <Typography key={i.id}
                        sx={{pl: 1, '&:hover': {backgroundColor: 'action.hover'}}}>
                        <Link
                          // eslint-disable-next-line max-len
                          href={`/boards/items/${i.title.toLocaleLowerCase().trim().replace(/ /g, '-')}/${i.id}`}
                          style={{textDecoration: "none", color: theme.palette.text.primary}} >
                          {i.title}
                        </Link>
                      </Typography>
                    </Box>

                  )) }
                  {
                    !c.items.length && ( <Typography>Comming soon.</Typography>)
                  }
                </CardContent>
              </Card>
            </Grid>
          ))
          }
        </Grid>
      </ Box>
    </>

  )
}

export default PublicBoardPage

export const getStaticPaths = async () => {
  let boards: Board[] = await findProjectBoards('64b6bc0a1b836981ba0c4cc5')

  const paths = boards.map((b: Board) =>
    ({ params: {dirId: b.title.toLowerCase().replace(/[^a-z]/g, '')}}))


  return {paths, fallback: false}
}

export const getStaticProps = async ({params}: any) => {

  const {dirId} = params
  const pb = await publicBoards.find( (pb) => pb.dirId === dirId)

  const board = await findPublicBoard(pb.id)

  return {props: {board}}

}