import {Grid, Card, CardHeader, CardContent, useTheme, Typography, Box} from "@mui/material"

import Link from "next/link"
import { GetStaticProps, InferGetServerSidePropsType } from "next"

import { Item } from "@/interfaces/ItemInterface"
import { Column } from "@/interfaces/Column"
import { Board } from "@/interfaces/BoardInterface"

import { FxTheme } from "theme/globalTheme"
import { findProjectBoards } from "@/mongo/controls/member/project/projectControls"


const websiteProjectId: string = '64b6bc0a1b836981ba0c4cc5'

export interface HomePage{ boards: Board[]}

export const getStaticProps: GetStaticProps<HomePage> = async () => {
  let boards: Board[] = await findProjectBoards(websiteProjectId)
  return {props: { boards}}
}

const Page = (homePage: InferGetServerSidePropsType<typeof getStaticProps>) => {

  const {boards} = homePage
  const theme: FxTheme = useTheme()

  return (
    <Box sx={{ p: theme.defaultPadding}}>
      <Grid container spacing={theme.defaultPadding}>
        { boards.map( (b: Board) => (
          <Grid item xs={12} md={6} lg={4} key={b.id}>
            <Card >
              <Link href={`/boards/${b.title.toLowerCase().replace(/ /g, '')}`}
                style={{textDecoration: "none"}} >
                <CardHeader title={ <Typography variant={'h6'} >{b.title}</Typography>}
                  sx={{bgcolor: "secondary.main", color: "secondary.contrastText"}} />
              </Link>
              <CardContent style={{height: "175px", overflow: "auto", paddingBottom: "0px"}}>
                {b?.columns.map( (c: Column) => (
                  <Box sx={{ pb: 1}} key={c.id}>
                    <Typography variant={'h6'} sx={{ fontSize: '16px'}} >{c.title}</Typography>
                    { c.items && c?.items.map( (i: Item) => (
                      <Typography key={i.id}
                        sx={{pl: 1, '&:hover': {backgroundColor: 'action.hover'}}}>
                        <Link
                          // eslint-disable-next-line max-len
                          href={`/boards/items/${i.title.toLocaleLowerCase().trim().replace(/ /g, '-')}/${i.id}`}
                          style={{textDecoration: "none", color: theme.palette.text.primary}} >
                          {i.title}
                        </Link>
                      </Typography>
                    )) }
                    { !c.items.length && ( <Typography>Comming soon.</Typography>) }
                  </ Box>
                ))}
                { b.columns.length < 1 && ( <Typography>Comming soon.</Typography>) }
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Page

// QA: done 8-3-23