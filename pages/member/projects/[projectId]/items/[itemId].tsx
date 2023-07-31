import { useState } from "react";

import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { CardContent, CardHeader, Stack, Typography } from "@mui/material";

import { findProject } from "@/mongo/controls/member/project/findProject";
import { getItem } from "@/mongo/controllers/itemControllers";

import { Project, ProjectContext } from "@/interfaces/ProjectInterface";
import { Member } from "@/interfaces/MemberInterface";
import { Item, ItemContext } from "@/interfaces/ItemInterface";

import Permission,
{ PermissionCodes, permission, NoPermission } from "@/ui/permission/old-Permission";
import InfoCardContainer from "@/ui/information-card/InfoCardContainer";
import InfoCard from "@/ui/information-card/InfoCard";

import EditItemTitleForm from "@/itemComponents/forms/EditItemTitleForm";
import CreateSectionForm from "@/itemComponents/sections/forms/CreateSectionForm";
import { TextSection } from "@/itemComponents/sections/TextSection";
import { CodeSection } from "@/itemComponents/sections/CodeSection";
import { Section } from "@/interfaces/SectionInterface";
import { findMember } from "@/mongo/controls/member/memberControls";


export interface MemberItemPageProps {
  project: Project;
  member: Member;
  item: any;
}
export const MemberItemPage = (props: MemberItemPageProps) => {

  const {member, project} = props

  const [item, setItem] = useState<Item>(props.item)
  const [showForm, setShowForm] = useState<boolean>(false)

  const ItemTitle = (
    <>
      <Permission code={PermissionCodes.ITEM_OWNER} item={item} member={member}>
        <Typography variant={'h6'} onClick={() => setShowForm(true)} >
          {item.title}
        </Typography>
      </ Permission>
      <NoPermission code={PermissionCodes.ITEM_OWNER} item={item} member={member}>
        <Typography variant={'h6'} > {item.title} </Typography>
      </NoPermission>
    </>
  )

  const EditItemTitle = ( <EditItemTitleForm closeForm={() => setShowForm(false)}/> )

  return (
    <ProjectContext.Provider value={{project, setProject: () => {}}}>
      <ItemContext.Provider value={{item, setItem}}>
        <InfoCardContainer >
          <InfoCard>
            <CardHeader title={ showForm ? EditItemTitle : ItemTitle }
              sx={{backgroundColor: 'secondary.main', color: 'secondary.contrastText'}} />
            <CardContent sx={{pl: 3}}>
              <Stack spacing={3} alignItems={'flex-start'}>
                { item.sections?.map( ( s: Section) => {
                  if(s.sectiontype === "63b88d18379a4f30bab59bad"){
                    return (
                      <CodeSection project={project} section={s} member={member} key={s.id}/>
                    )
                  }
                  return ( <TextSection project={project} section={s} member={member} key={s.id} />)
                })}
                <CreateSectionForm member={member} />
              </Stack>
            </CardContent>
          </InfoCard>
        </InfoCardContainer>
      </ItemContext.Provider>
    </ProjectContext.Provider>
  )
}

export default MemberItemPage


export const getServerSideProps:
GetServerSideProps<MemberItemPageProps> = async(context) => {

  const authSession = await getSession({req: context.req})

  if(!authSession){
    return {redirect: {destination: "/", permanent: false}}
  }

  const member: Member | false = await findMember(authSession?.user?.email)

  if(member){
    const project: Project = await findProject(context.query.projectId)
    const hasPermission = permission({code: PermissionCodes.PROJECT_MEMBER, member, project})

    if(hasPermission){
      const item = await getItem(context.query.itemId)
      return {props: {project, member, item}}
    }
  }
  return {redirect: {destination: "/", permanent: false}}
}