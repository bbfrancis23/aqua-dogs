import {Grid, Card, CardHeader, CardContent, useTheme, Typography, Box} from "@mui/material"

import Link from "next/link"
import Head from 'next/head'

import { GetStaticProps, InferGetServerSidePropsType } from "next"

import { Item } from "@/interfaces/ItemInterface"
import { Column } from "@/interfaces/ColumnInterface"
import { Board } from "@/interfaces/BoardInterface"

import { FxTheme } from "theme/globalTheme"
import { findProjectBoards } from "@/mongo/controls/member/project/projectControls"
import { getPublicBoardDirectory } from "./categories/[dirId]/PublicCategoryPage"
import { getPublicCardDirectory } from "./cards/[catId]/[dirId]/[itemId]/PublicCardPage"

/********  Interfaces Globals and Helpers *********/

export const DESCRIPTION = "A Simple way to Orginize your Projects and impliment Strategies. "
  + "Hundreds of Software Developement Best Practices, Standards and Eamples."
export const KEYWORDS = "JavaScript, TypeScript, React, Next.js, Node.js, MongoDB, Github, Git, "
  + "HTML, CSS, SCSS, SASS, Material-UI, MUI, Strategy, Project, Organization, Best Practices, "
  + "VS Code, Software Development, Web Framwork, Web Development, Web App, Web Application,  "
  + "Mongoose, Express, Material-UI, MUI, Strategy, Project, Organization, Best Practices,  "
  + "Standards, Examples, Software Development, Web Framwork, Web Development, "
  + "Web App, Web Application, Full Stack, Full Stack Development, Full Stack Developer, "
  + "Software Engineer, Software Engineering, Software Developer, Software Development Engineer "

const CategoryHeader = (props: {title: string}) => (
  <Typography variant={'h2'} sx={{fontSize: '1.25rem', fontWeight: '500'}}>
    {props.title}
  </Typography>
)

const websiteProjectId: string = '64b6bc0a1b836981ba0c4cc5'

export interface HomePage{ boards: Board[]}

/********** Backend **********/

export const getStaticProps: GetStaticProps<HomePage> = async () => {
  let boards: Board[] = await findProjectBoards(websiteProjectId)

  return {props: { boards}}
}

/********** Frontend **********/
const Page = (homePage: InferGetServerSidePropsType<typeof getStaticProps>) => {

  const {boards} = homePage
  const theme: FxTheme = useTheme()

  return (
    <>
      <Head>
        <title>Strategy Fx - Simple Project Strategies and Organization.</title>
        <meta name="description" content={DESCRIPTION} />
        <meta name="keywords" content={KEYWORDS} />
      </Head>
      <Box sx={{ p: theme.defaultPadding}}>
        <Grid container spacing={theme.defaultPadding}>
          { boards.map( (b: Board) => (
            <Grid item xs={12} md={6} lg={4} key={b.id}>
              <Card >
                <Link href={`/categories/${getPublicBoardDirectory(b)}`}
                  style={{textDecoration: "none"}} >
                  <CardHeader title={ <CategoryHeader title={b.title} />}
                    sx={{bgcolor: "secondary.main", color: "secondary.contrastText"}} />
                </Link>
                <CardContent style={{height: "175px", overflow: "auto", paddingBottom: "0px"}}>
                  {b?.columns.map( (c: Column) => (
                    <Box sx={{ pb: 1}} key={c.id}>
                      <Typography variant={'h3'} sx={{ fontSize: '16px', fontWeight: '500'}} >
                        {c.title}
                      </Typography>
                      { c.items && c?.items.map( (i: Item) => (
                        <Typography key={i.id}
                          sx={{pl: 1, '&:hover': {backgroundColor: 'action.hover'}}}>
                          <Link
                          // eslint-disable-next-line max-len
                            href={`/cards/${getPublicBoardDirectory(b)}/${getPublicCardDirectory(i)}/${i.id}`}
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
      <Box sx={{ display: 'flex', height: '25px',
        color: 'secondary.constrastText',
        justifyContent: 'center',
        width: '100%',
        borderTop: '1px solid',
        borderColor: theme.palette.divider}} >
        <Link href={'/privacy-policy'}
          style={{textDecoration: "none", color: theme.palette.text.primary,
            paddingRight: '15px'}} >
            Privacy Policy
        </Link>
        <Link href={'/terms-of-use'}
          style={{textDecoration: "none", color: theme.palette.text.primary}} >Terms of Use</Link>
      </Box>
    </>

  )
}

export default Page

// QA: done 9-27-23