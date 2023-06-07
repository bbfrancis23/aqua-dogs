import { GetServerSideProps } from "next";
import { Project } from "../../../interfaces/ProjectInterface";
import { getSession } from "next-auth/react";
import { Member, getValidMember } from "../../../interfaces/MemberInterface";
import permission, { PermissionCodes } from "../../../ui/permission/Permission";
import InfoCardContainer from "../../../ui/information-card/InfoCardContainer";
import InfoCard from "../../../ui/information-card/InfoCard";
import { CardHeader } from "@mui/material";
import { useState } from "react";


import { findProject } from '../../../mongo/controls/project/findProject';
import ProjectTitleForm from "../../../components/projects/forms/ProjectTItleForm";

export interface MemberProjectPageProps{
  project: Project;
}

export const MemberProjectPage = (props: MemberProjectPageProps) => {

  const [project, setProject] = useState<Project>(props.project)


  return (
    <InfoCardContainer >
      <InfoCard>
        <CardHeader title={<ProjectTitleForm project={project}/>} />
      </InfoCard>
    </InfoCardContainer>

  )
}
export default MemberProjectPage

export const getServerSideProps: GetServerSideProps<MemberProjectPageProps> = async(context) => {

  const authSession = await getSession({req: context.req})

  if(!authSession){
    return {redirect: {destination: "/", permanent: false}}
  }


  const member: Member | false = await getValidMember(authSession)

  if(member){
    const project: any = await findProject(context.query.projectId)

    const hasPermission = permission(PermissionCodes.PROJECT_MEMBER, member, project)

    if(hasPermission){

      return {props: {project}}
    }
  }

  return {redirect: {destination: "/", permanent: false}}
}