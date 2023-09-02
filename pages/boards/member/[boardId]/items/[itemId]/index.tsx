import { Member } from "@/interfaces/MemberInterface"
import { Project } from "@/interfaces/ProjectInterface"
import { GetServerSideProps, Redirect } from "next"

import dynamic from "next/dynamic";

import { getSession } from "next-auth/react"

import { findMember } from "@/mongo/controls/member/memberControls"

import { findProject } from "@/mongo/controls/member/project/projectControls"
import { PermissionCodes, permission } from "@/ui/PermissionComponent"

import { findItem } from "@/mongo/controls/member/project/items/findItem"
import findMemberPublicBoard from "@/mongo/controls/member/project/board/findMemberPublicBoard"
import { Board } from "@/interfaces/BoardInterface"
import InfoPageLayout from "@/ui/InfoPageLayout"
import { Stack, Typography } from "@mui/material"
import { Section } from "@/interfaces/SectionInterface"

const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  {ssr: false}
)

export interface PublicMemberItemPageProps {
  item: any
}
const unAuthRedirect: Redirect = {destination: "/", permanent: false}

export const getServerSideProps:

GetServerSideProps<PublicMemberItemPageProps> = async(context) => {

  if(!context.query.boardId) return {redirect: unAuthRedirect}
  if( typeof context.query.boardId !== "string" ) return {redirect: unAuthRedirect}

  const board: Board = await findMemberPublicBoard(context.query.boardId)

  if(!board) return {redirect: unAuthRedirect}

  if( typeof context.query.itemId !== "string" ) return {redirect: unAuthRedirect}

  const item = await findItem(context?.query?.itemId)
  return {props: { item}}


}

export const PublicMemberItemPage = ( props: any) => {


  const {item} = props

  return (


    <InfoPageLayout title={ <Typography variant={'h1'}
      sx={{p: 5, pl: 2, fontSize: {xs: '2rem', sm: '3rem'}, width: '100%' }}>
      {item.title}
    </Typography> }>
      <Stack spacing={3} alignItems={'flex-start'} sx={{p: 10, pt: 5, width: '100%'}}>
        { item.sections?.map( ( s: Section) => {
          if(s.sectiontype === "63b88d18379a4f30bab59bad"){
            return (
              <CodeEditor
                key={s.id}
                value={s.content}
                language="jsx"
                readOnly
                padding={15}
                style={{
                  width: '100%',
                  fontSize: 12,
                  backgroundColor: "#f5f5f5",
                  fontFamily:
                            "ui-monospace,SF Mono,Consolas,Liberation Mono,Menlo,monospace"
                }}
              />
            )
          }
          return ( <Typography key={s.id}>
            {s.content}
          </Typography>)
        })}

      </Stack>
    </InfoPageLayout>
  )
}

export default PublicMemberItemPage

// TODO: replace getItem with findItem