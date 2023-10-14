import { useState } from "react"

import { GetServerSideProps, Redirect } from "next"
import { getSession } from "next-auth/react"

import { Stack, Typography } from "@mui/material"

import { findMember } from "@/mongo/controls/member/memberControls"
import { findProject } from "@/mongo/controls/member/project/projectControls"
import { findItem } from "@/mongo/controls/member/project/items/findItem"

import InfoPageLayout from "@/ui/InfoPageLayout"
import Permission, { NoPermission, PermissionCodes, permission } from "@/ui/PermissionComponent"

import { Project, ProjectContext } from "@/interfaces/ProjectInterface"
import { Member, MemberContext } from "@/interfaces/MemberInterface"
import { ItemContext } from "@/react/item/ItemContext"

import { Section } from "@/interfaces/SectionInterface"

import EditItemTitleForm from "@/components/items/forms/EditItemTitleForm"
import CreateSectionForm from "@/components/items/forms/CreateSectionForm"
import TextSection from "@/components/items/sections/TextSection"
import CodeSection from "@/components/items/sections/CodeSection"
import ArchiveItemForm from "@/components/items/forms/ArchiveItemForm"
import { Item } from "@/react/item/item-types"


export interface MemberItemPageProps {
  project: Project
  member: Member
  item: any
}
export const ItemPage = (props: MemberItemPageProps) => {

  const {member, project} = props

  const [item, setItem] = useState<Item>(props.item)
  const [showForm, setShowForm] = useState<boolean>(false)

  const ItemTitle = (
    <>
      <Permission code={PermissionCodes.ITEM_OWNER} item={item} member={member}>
        <Typography variant={'h1'}
          sx={{p: 5, pl: 2, fontSize: {xs: '2rem', sm: '3rem'}, width: '100%' }}
          onClick={() => setShowForm(true)} noWrap>
          {item.title}
        </Typography>
      </ Permission>
      <NoPermission code={PermissionCodes.ITEM_OWNER} item={item} member={member}>
        <Typography variant={'h1'}
          sx={{p: 5, pl: 2, fontSize: {xs: '2rem', sm: '3rem'}, width: '100%' }}>
          {item.title}
        </Typography>
      </NoPermission>
    </>
  )

  const EditItemTitle = ( <EditItemTitleForm closeForm={() => setShowForm(false)}/> )

  return (
    <ProjectContext.Provider value={{project, setProject: () => {}}}>
      <ItemContext.Provider value={{item, setItem}}>
        <MemberContext.Provider value={{member, setMember: () => {}}}>
          <InfoPageLayout title={ showForm ? EditItemTitle : ItemTitle }>
            <Stack spacing={3} alignItems={'flex-start'} sx={{p: 10, pt: 5, width: '100%'}}>
              { item.sections?.map( ( s: Section) => {
                if(s.sectiontype === "63b88d18379a4f30bab59bad"){
                  return (
                    <CodeSection project={project} section={s} member={member} key={s.id}/>
                  )
                }
                return ( <TextSection project={project} section={s} member={member} key={s.id} />)
              })}
              <CreateSectionForm member={member} />
              <ArchiveItemForm />
            </Stack>
          </InfoPageLayout>
        </MemberContext.Provider>
      </ItemContext.Provider>
    </ProjectContext.Provider>
  )
}

export default ItemPage


const unAuthRedirect: Redirect = {destination: "/", permanent: false}
export const getServerSideProps:
GetServerSideProps<MemberItemPageProps> = async(context) => {

  const authSession = await getSession({req: context.req})

  if(!authSession){
    return {redirect: {destination: "/", permanent: false}}
  }

  const member: Member | false = await findMember(authSession?.user?.email)

  if(member){

    if( typeof context.query.projectId !== "string" ) return {redirect: unAuthRedirect}

    const project: Project = await findProject(context.query.projectId)
    const hasPermission = permission({code: PermissionCodes.PROJECT_MEMBER, member, project})

    if(hasPermission){

      if( typeof context.query.itemId !== "string" ) return {redirect: unAuthRedirect}

      const item = await findItem(context?.query?.itemId)
      return {props: {project, member, item}}
    }
  }
  return {redirect: {destination: "/", permanent: false}}
}

// QA: Brian Francis 9-27-2023
// Depreciated: 9-27-2023 use Modal instead
// TODO: replace getItem with findItem