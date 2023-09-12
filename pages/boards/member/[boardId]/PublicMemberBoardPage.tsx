import { Board } from "@/interfaces/BoardInterface";
import { Column } from "@/interfaces/ColumnInterface";
import { Item } from "@/interfaces/ItemInterface";
import findMemberPublicBoard from "@/mongo/controls/member/project/board/findMemberPublicBoard";
import { Box, Card, CardContent, CardHeader, Grid, Typography, useTheme } from "@mui/material";
import { GetServerSideProps, Redirect } from "next";
import Link from "next/link";
import { FxTheme } from "theme/globalTheme";


export interface PublicMemberBoardPage {
  board: Board
}
// redeploy
const unAuthRedirect: Redirect = {destination: "/", permanent: false}

export const getServerSideProps: GetServerSideProps<PublicMemberBoardPage> = async(context) => {

  if(!context.query.boardId) return {redirect: unAuthRedirect}
  if( typeof context.query.boardId !== "string" ) return {redirect: unAuthRedirect}

  const board: Board = await findMemberPublicBoard(context.query.boardId)

  return {props: {board}}

}

export const Page = ( props: {board: Board}) => {

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
                          href={`/boards/member/${board.id}/items/${i.id}`}
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

export default Page