import {Grid, Card, CardHeader, CardContent, useTheme, Typography, Box} from "@mui/material"

import Link from "next/link"
import { GetStaticProps } from "next"
import { findProjectBoards } from "@/mongo/controls/member/project/findProjectBoards"
import { Board } from "@/interfaces/BoardInterface"
import { Column } from "@/interfaces/Column"
import { FxTheme } from "theme/globalTheme"
import { Item } from "@/interfaces/ItemInterface"

export interface HomePageProps{
  boards: Board[]
}

const HomePage = (props: HomePageProps) => {

  const {boards} = props
  const theme: FxTheme = useTheme()

  return (
    <Box sx={{ p: 3, pb: 12, height: '100vh', overflow: 'auto'}}>
      <Grid container spacing={3}>
        { boards.map( (b: Board) => (
          <Grid item xs={12} md={6} lg={4} key={b.id}>
            <Card >
              <Link
                href={`/boards/${b.title.toLowerCase().replace(/ /g, '')}`}
                style={{textDecoration: "none"}}
              >
                <CardHeader
                  title={ <Typography variant={'h6'} >{b.title}</Typography>}
                  sx={{bgcolor: "secondary.main", color: "secondary.contrastText"}} />
              </Link>

              <CardContent style={{height: "175px", overflow: "auto", paddingBottom: "0px"}}>
                {b?.columns.map( (c: Column) => (
                  <Box sx={{ pb: 1}} key={c.id}>
                    <Typography variant={'h6'} sx={{ fontSize: '16px'}} >
                      {c.title}
                    </Typography>
                    {
                      c.items && c?.items.map( (i: Item) => (
                        <Typography key={i.id} sx={{pl: 1}}>
                          {i.title}
                        </Typography>
                      ))
                    }
                    {
                      !c.items.length && ( <Typography>Comming soon.</Typography>)
                    }
                  </ Box>
                ))}
                {
                  b.columns.length < 1 && ( <Typography>Comming soon.</Typography>)
                }
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>

  )
}

export const getStaticProps: GetStaticProps = async () => {
  let boards: Board[] = await findProjectBoards('64b6bc0a1b836981ba0c4cc5')
  return {props: { boards}}
}

export default HomePage