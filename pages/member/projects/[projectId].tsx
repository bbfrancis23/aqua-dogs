import { GetServerSideProps } from "next";
import { Project } from "../../../interfaces/ProjectInterface";
import { getSession } from "next-auth/react";
import { Member, getValidMember } from "../../../interfaces/MemberInterface";
import Permission, { permission, PermissionCodes } from "../../../ui/permission/Permission";
import InfoCardContainer from "../../../ui/information-card/InfoCardContainer";
import InfoCard from "../../../ui/information-card/InfoCard";
import { Box, CardContent, CardHeader, Divider, List, Stack, Typography } from "@mui/material";
import { useState } from "react";


import { findProject } from '../../../mongo/controls/project/findProject';
import ProjectTitleForm from "../../../components/projects/forms/ProjectTItleForm";
import ProjectMember from "../../../components/projects/ProjectMember";
import AddProjectMemberForm from "../../../components/projects/forms/AddProjectMemberForm";
export interface MemberProjectPageProps{
  project: Project;
  member: Member;
}

export const MemberProjectPage = (props: MemberProjectPageProps) => {

  const {member} = props

  const [project, setProject] = useState<Project>(props.project)

  console.log('project', project)

  return (
    <InfoCardContainer >
      <InfoCard>
        <CardHeader title={<ProjectTitleForm project={project}/>} />
        <CardContent sx={{pl: 1, display: 'flex'}}>
          <Stack spacing={3} sx={{ pl: 3}}>
            <Typography variant="h5">Members:</Typography>

            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              { project?.leader && (
                <ProjectMember project={project} setProject={setProject}
                  sessionMember={member}
                  member={project.leader} type={PermissionCodes.PROJECT_LEADER} />
              )}

              {project?.admins?.map( (m:Member) => (

                <ProjectMember member={m} type={PermissionCodes.PROJECT_ADMIN}
                  sessionMember={member} key={m.id}
                  project={project} setProject={setProject}/>
              ))}

              { project?.members?.map( (m:Member) => (
                <Box key={m.id}>
                  <Divider variant="inset" component="li" />
                  <ProjectMember
                    sessionMember={member}
                    member={m} type={PermissionCodes.PROJECT_MEMBER}
                    project={project} setProject={setProject}/>
                </Box>
              ))}


              <Permission code={PermissionCodes.PROJECT_ADMIN} project={project} member={member}>
                <AddProjectMemberForm project={project} setProject={(p: Project) => setProject(p)}/>
              </Permission>
            </List>
          </Stack>
        </CardContent>
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

      // console.log(project)

      return {props: {project, member}}
    }
  }

  return {redirect: {destination: "/", permanent: false}}
}