import { GetServerSideProps, Redirect } from "next"
import { useContext } from "react"
import { Box, Card, CardContent, CardHeader, Grid, Typography } from "@mui/material"
import findMemberPublicBoard from "@/mongo/controls/member/project/board/findMemberPublicBoard"
import { Board } from "@/react/board"
import { Column } from "@/react/column"
import { Item } from "@/react/item"
import { FxThemeContext } from "@/fx/theme"
import { HoverLink } from "@/fx/ui"


export interface PublicMemberBoardPage { board: Board}
const unAuthRedirect: Redirect = {destination: "/", permanent: false}

export const getServerSideProps: GetServerSideProps<PublicMemberBoardPage> = async(context) => {

  if(!context.query.boardId) return {redirect: unAuthRedirect}
  if( typeof context.query.boardId !== "string" ) return {redirect: unAuthRedirect}

  const board: Board = await findMemberPublicBoard(context.query.boardId)

  return {props: {board}}

}

export const Page = ( {board}: {board: Board}) => {

  const {fxTheme: fx} = useContext(FxThemeContext)
  const boardDir = `/boards/member/${board.id}`

  return (
    <>
      <Typography variant="h4" sx={{ pl: 5, position: 'relative', top: '10px'}}>
        {board.title}
      </Typography>
      <Box sx={{ p: fx.theme.defaultPadding}}>
        <Grid container spacing={fx.theme.defaultPadding}>
          { board.columns.map( (c: Column) => (
            <Grid item xs={12} md={6} lg={4} key={c.id}>
              <Card >
                <CardHeader color={'secondary'}
                  title={<Typography variant={'h6'} >{c.title}</Typography>} />
                <CardContent sx={{ paddingBottom: "0px"}}>
                  { c.items && c?.items.map( (i: Item) => (
                    <Box sx={{ pb: 1}} key={i.id}>
                      <HoverLink href={`${boardDir}/items/${i.id}`} title={i.title} />
                    </Box>
                  ))}
                  { !c.items.length && ( <Typography>Comming soon.</Typography>) }
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

// QA: Brian Francis 11-02-23