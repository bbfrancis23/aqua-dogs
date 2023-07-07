import { useState } from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { Button, CardContent, CardHeader, Stack, Typography, useTheme } from "@mui/material";
import { Project } from "@/interfaces/ProjectInterface";
import { Member, getValidMember } from "@/interfaces/MemberInterface";

import { findProject } from "@/mongo/controls/member/project/findProject";

import Permission, { PermissionCodes, permission } from "@/ui/permission/Permission";
import { useSnackbar } from "notistack";
import { getItem } from "@/mongo/controllers/itemControllers";
import InfoCardContainer from "@/ui/information-card/InfoCardContainer";
import InfoCard from "@/ui/information-card/InfoCard";
import EditItemTitleForm from
  "@/components/members/projects/boards/columns/items/forms/EditItemTitleForm";
import { Item } from "@/interfaces/ItemInterface";
import { Section } from "@/interfaces/SectionInterface";
import SectionStub from "@/components/members/projects/boards/columns/items/sections/SectionStub";
import CreateSectionForm from
  "@/components/members/projects/boards/columns/items/sections/forms/CreateSectionForm";

export interface MemberItemPageProps {
  project: Project;
  member: Member;
  item: any;
}

export const MemberItemPage = (props: MemberItemPageProps) => {


  const {member, project} = props

  const theme = useTheme()
  const [item, setItem] = useState<Item>(props.item)
  const {enqueueSnackbar} = useSnackbar()


  const [showForm, setShowForm] = useState<boolean>(false)
  const [displayCreateSectionForm, setDisplayCreateSectionForm] = useState<boolean>(false)


  return (
    <InfoCardContainer >
      <InfoCard>
        <CardHeader
          title={
            showForm ? <EditItemTitleForm project={project}
              item={item} closeForm={() => setShowForm(false)}/>
              : <Typography variant={'h4'}
                onClick={() => setShowForm(true)} >{item.title}</Typography>
          } />
        <CardContent sx={{pl: 3}}>
          <Stack spacing={3} alignItems={'flex-start'}>
            {
              item.sections?.map( (s: Section) => (
                <>
                  Section
                  <Typography key={s.id}>{s.content}</Typography>
                </>

              ))
            }

            <Permission code={PermissionCodes.ITEM_OWNER} item={item} member={member}>

              <CreateSectionForm project={project} member={member} setItem={(i) => setItem(i)}/>
            </Permission>

          </Stack>
        </CardContent>
      </InfoCard>
    </InfoCardContainer>
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


      console.log(item)

      return {props: {project, member, item}}
    }
  }
  return {redirect: {destination: "/", permanent: false}}
}