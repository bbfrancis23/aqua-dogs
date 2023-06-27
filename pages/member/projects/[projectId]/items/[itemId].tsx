import { useState } from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { CardContent, CardHeader, Stack, Typography, useTheme } from "@mui/material";
import { Project } from "@/interfaces/ProjectInterface";
import { Member, getValidMember } from "@/interfaces/MemberInterface";

import { findProject } from "@/mongo/controls/member/project/findProject";

import { PermissionCodes, permission } from "@/ui/permission/Permission";
import { useSnackbar } from "notistack";
import { getItem } from "@/mongo/controllers/itemControllers";
import InfoCardContainer from "@/ui/information-card/InfoCardContainer";
import InfoCard from "@/ui/information-card/InfoCard";
import EditItemTitleForm from
  "@/components/members/projects/boards/columns/items/forms/EditItemTitleForm";

export interface MemberItemPageProps {
  project: Project;
  member: Member;
  item: any;
}

export const MemberItemPage = (props: MemberItemPageProps) => {

  const {member, project, item} = props

  const theme = useTheme()
  const {enqueueSnackbar} = useSnackbar()

  const [showForm, setShowForm] = useState<boolean>(false)

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

    const hasPermission = permission(PermissionCodes.PROJECT_MEMBER, member, project)

    if(hasPermission){


      const item = await getItem(context.query.itemId)

      return {props: {project, member, item}}
    }
  }
  return {redirect: {destination: "/", permanent: false}}
}