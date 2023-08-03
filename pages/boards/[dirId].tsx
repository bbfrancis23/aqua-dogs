import { Board } from "@/interfaces/BoardInterface"
import { findProjectBoards } from "@/mongo/controls/member/project/old-findProjectBoards"
import {findPublicBoard} from "@/mongo/controls/member/project/board/findPublicBoard"
import { Box, Card, CardContent, CardHeader, Grid, Typography } from "@mui/material"
// import {publicBoards} from "../../../../publicBoards"
import { publicBoards } from "data/publicBoards";
import { Column } from "@/interfaces/Column";
import { Item } from "@/interfaces/ItemInterface";

export const PublicBoardPage = ( props: any) => {

  const {board} = props
  return (
    <>
      <Typography variant="h5"
        sx={{ pl: 5, position: 'relative', top: '10px'}}>{board.title}</Typography>
      <Box sx={{ p: 3, pb: 12, }}>

        <Grid container spacing={3}>

          {
            board.columns.map( (c: Column) => (
              <Grid item xs={12} md={6} lg={4} key={c.id}>
                <Card key={c.id}>
                  <CardHeader
                    title={<Typography variant={'h6'} >{c.title}</Typography>}
                    sx={{bgcolor: "primary.main", color: "primary.contrastText"}}
                  />
                  <CardContent
                    sx={{ paddingBottom: "0px"}}>
                    {
                      c.items && c?.items.map( (i: Item) => (

                        <Card key={i.id} sx={{ mb: 3}}>
                          <CardHeader
                            title={<Typography variant={'h6'} >{i.title}</Typography>}
                            sx={{bgcolor: "secondary.main", color: "secondary.contrastText"}}
                          />
                          <CardContent

                            style={{textOverflow: 'ellipsis',
                              overflow: 'hidden', whiteSpace: 'nowrap'}}>
                            {
                              (i.sections && i.sections.length > 0) &&
                              i.sections[0].content
                            }
                          </CardContent>

                        </Card>

                      ))
                    }
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
    ({ params: {dirId: b.title.toLowerCase().replace(/ /g, '')}}))


  return {paths, fallback: false}
}

export const getStaticProps = async ({params}: any) => {

  const {dirId} = params
  const pb = await publicBoards.find( (pb) => pb.dirId === dirId)

  const board = await findPublicBoard(pb.id)

  return {props: {board}}

}