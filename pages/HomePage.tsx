import {Grid, useTheme, Typography, Box, Theme} from "@mui/material"

import Link from "next/link"
import Head from 'next/head'

import { GetStaticProps, InferGetServerSidePropsType } from "next"

import { Item } from "@/interfaces/ItemInterface"
import { Column } from "@/interfaces/ColumnInterface"
import { Board } from "@/interfaces/BoardInterface"

import { FxTheme } from "theme/globalTheme"
import { findProjectBoards } from "@/mongo/controls/member/project/projectControls"
import { getPublicBoardDirectory} from "./categories/[dirId]/PublicCategoryPage"
import { getPublicCardDirectory} from "./cards/[catId]/[dirId]/[itemId]/PublicCardPage"

import AppFooter from "@/react/app/components/AppFooter"
import ListCard from "@/ui/ListCard"
import { HoverLink } from "@/ui/HoverLink"

export const DESCRIPTION = "A Simple way to Orginize your Projects and impliment Strategies. "
  + "Hundreds of Software Developement Best Practices, Standards and Eamples."
export const KEYWORDS = "JavaScript, TypeScript, React, Next.js, Node.js, MongoDB, Github, Git, "
  + "HTML, CSS, SCSS, SASS, Material-UI, MUI, Strategy, Project, Organization, Best Practices, "
  + "VS Code, Software Development, Web Framwork, Web Development, Web App, Web Application,  "
  + "Mongoose, Express, Material-UI, MUI, Strategy, Project, Organization, Best Practices,  "
  + "Standards, Examples, Software Development, Web Framwork, Web Development, "
  + "Web App, Web Application, Full Stack, Full Stack Development, Full Stack Developer, "
  + "Software Engineer, Software Engineering, Software Developer, Software Development Engineer "

const CategoryHeader = ({title, href}: {title: string, href: string}) => (
  <Link href={`/categories/${href}`} >
    <Typography variant={'h2'} sx={{fontSize: '1.25rem',
      fontWeight: '500', color: "secondary.contrastText"}}>
      {title}
    </Typography>
  </Link>
)

const websiteProjectId: string = '64b6bc0a1b836981ba0c4cc5'

export interface HomePage{ boards: Board[]}

export const getStaticProps: GetStaticProps<HomePage> = async () => {

  let boards: Board[] = await findProjectBoards(websiteProjectId)
  return {props: { boards}}
}

const Page = ({boards}: InferGetServerSidePropsType<typeof getStaticProps>) => {

  const theme: FxTheme = useTheme()

  const getBoardDirectory = (board: Board): string => (
    getPublicBoardDirectory(board)
  )

  const getCardDirectory = (b: Board, c: Item): string => (
    `/cards/${getPublicBoardDirectory(b)}/${getPublicCardDirectory(c)}/${c.id}`
  )

  return (
    <>
      <Head>
        <title>Strategy Fx - Simple Project Strategies and Organization.</title>
        <meta name="description" content={DESCRIPTION} />
        <meta name="keywords" content={KEYWORDS} />
      </Head>
      <Box sx={{ p: theme.defaultPadding}}>
        <Grid container spacing={theme.defaultPadding}>
          { boards?.map( (b: Board) => (
            <Grid item xs={12} md={6} lg={4} key={b.id}>
              <ListCard title={ <CategoryHeader title={b.title} href={getBoardDirectory(b)} /> } >
                <>
                  {b?.columns.map( (c: Column) => (
                    <Box sx={{ pb: 1}} key={c.id}>
                      <Typography variant={'h3'} sx={{ fontSize: '16px', fontWeight: '500'}} >
                        {c.title}
                      </Typography>
                      { c.items && c?.items.map( (i: Item) => (
                        <HoverLink key={i.id} href={getCardDirectory(b, i)} title={i.title} />
                      )) }
                      { !c.items.length && ( <Typography>Comming soon.</Typography>) }
                    </ Box>
                  ))}
                  { b.columns.length < 1 && ( <Typography>Comming soon.</Typography>) }
                </>
              </ListCard>
            </Grid>
          ))}
        </Grid>
      </Box>
      <AppFooter />
    </>

  )
}

export default Page

// QA: done 10-11-23