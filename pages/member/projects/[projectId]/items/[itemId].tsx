import { useState } from "react";

import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

import { CardContent, CardHeader, Stack, Typography } from "@mui/material";

import { findProject } from "@/mongo/controls/member/project/findProject";
import { getItem } from "@/mongo/controllers/itemControllers";

import { Project, ProjectContext } from "@/interfaces/ProjectInterface";
import { Member, getValidMember } from "@/interfaces/MemberInterface";
import { Item, ItemContext } from "@/interfaces/ItemInterface";
import { Section } from "@/interfaces/SectionInterface";

import Permission, { PermissionCodes, permission } from "@/ui/permission/Permission";
import InfoCardContainer from "@/ui/information-card/InfoCardContainer";
import InfoCard from "@/ui/information-card/InfoCard";

import EditItemTitleForm
  from "@/components/members/projects/boards/columns/items/forms/EditItemTitleForm";
import CreateSectionForm from
  "@/components/members/projects/boards/columns/items/sections/forms/CreateSectionForm";

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
    <Typography variant={'h4'} onClick={() => setShowForm(true)} >
      {item.title}
    </Typography>
  )

  const EditItemTitle = (
    <EditItemTitleForm closeForm={() => setShowForm(false)}/>
  )
  return (
    <ProjectContext.Provider value={{project, setProject: () => {}}}>
      <ItemContext.Provider value={{item, setItem}}>
        <InfoCardContainer >
          <InfoCard>
            <CardHeader title={ showForm ? EditItemTitle : ItemTitle } />
            <CardContent sx={{pl: 3}}>
              <Stack spacing={3} alignItems={'flex-start'}>
                { item.sections?.map( (s: Section) => (
                  <Typography key={s.id}>{s.content}</Typography>
                )) }
                <Permission code={PermissionCodes.ITEM_OWNER} item={item} member={member}>
                  <CreateSectionForm project={project} member={member} setItem={(i) => setItem(i)}/>
                </Permission>
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

  const member: Member | false = await getValidMember(authSession)

  if(member){
    const project: any = await findProject(context.query.projectId)
    const hasPermission = permission({code: PermissionCodes.PROJECT_MEMBER, member, project})

    if(hasPermission){
      const item = await getItem(context.query.itemId)
      return {props: {project, member, item}}
    }
  }
  return {redirect: {destination: "/", permanent: false}}
}