import { GetServerSideProps } from "next";
import { Project } from "../../../interfaces/ProjectInterface";
import { getSession } from "next-auth/react";
import { Member, getValidMember } from "../../../interfaces/MemberInterface";
import Permission, { permission, PermissionCodes } from "../../../ui/permission/Permission";
import InfoCardContainer from "../../../ui/information-card/InfoCardContainer";
import InfoCard from "../../../ui/information-card/InfoCard";
import { Box, Button, CardContent, CardHeader, Divider,
  Grid, List, Stack, Tooltip, Typography } from "@mui/material";
import { useState } from "react";


import {findProject} from "../../../mongo/controls/project/findProject"


import {findProjectBoards} from "../../../mongo/controls/project/findProjectBoards"

import { Board } from "../../../interfaces/BoardInterface";
import ProjectTitleForm from "../../../components/projects/forms/ProjectTItleForm";
import ProjectMember from "../../../components/projects/ProjectMember";
import AddProjectMemberForm from "../../../components/projects/forms/AddProjectMemberForm";
import CreateBoardForm from "../../../components/projects/boards/forms/CreateBoardForm";
import ProjectStub from "../../../components/projects/ProjectStub";
import BoardStub from "../../../components/projects/boards/BoardStub";
import router from "next/router";
export interface MemberProjectPageProps{
  project: Project;
  member: Member;
  boards: Board[];
}

export const MemberProjectPage = (props: MemberProjectPageProps) => {

  const {member} = props

  const [boards, setBoards] = useState<Board[] | []>(props.boards)

  const [project, setProject] = useState<Project>(props.project)

  const [showBoardForm, setShowBoardForm] = useState<boolean>(true)

  const handleCloseCreateBoardForm = () => {
    setShowBoardForm(false)
  }

  return (
    <InfoCardContainer >
      <InfoCard>
        <CardHeader title={<ProjectTitleForm project={project}/>} />
        <CardContent sx={{ pl: 3}}>

          <Typography variant="h5">Members:</Typography>
          <Stack spacing={3} >
            <Box sx={{ display: 'flex'}}>

              <List sx={{ bgcolor: 'background.paper' }}>
                { project?.leader && (
                  <ProjectMember project={project} setProject={setProject}
                    sessionMember={member}
                    member={project.leader} type={PermissionCodes.PROJECT_LEADER} />
                )}
                <Divider variant="inset" component="li" />
                {project?.admins?.map( (m:Member) => (

                  <ProjectMember member={m} type={PermissionCodes.PROJECT_ADMIN}
                    sessionMember={member} key={m.id}
                    project={project} setProject={setProject}/>
                ))}
                <Divider variant="inset" component="li" />
                { project?.members?.map( (m:Member) => (
                  <Box key={m.id}>

                    <ProjectMember
                      sessionMember={member}
                      member={m} type={PermissionCodes.PROJECT_MEMBER}
                      project={project} setProject={setProject}/>
                  </Box>
                ))}
                <Divider variant="inset" component="li" />

                <Permission code={PermissionCodes.PROJECT_ADMIN} project={project} member={member}>
                  <AddProjectMemberForm
                    project={project} setProject={(p: Project) => setProject(p)}/>
                </Permission>
              </List>
            </Box>

            <Typography variant="h5">Boards:</Typography>
            { showBoardForm && (
              <CreateBoardForm setBoards={(b:any) => setBoards(b)} project={project}
                closeForm={() => handleCloseCreateBoardForm()}/>
            ) }

            <Grid container spacing={1}>

              {
                boards.map( (b) => (
                  <Grid item xs={3} key={b.id}>
                    <Button
                      onClick={() => router.push(`/member/projects/${project.id}/boards/${b.id}`)}
                      sx={{ m: 0, p: 0}}>

                      <BoardStub board={b}/>
                    </Button>
                  </Grid>
                ))
              }


              <Grid item xs={3} >
                <Tooltip title="Create Board">

                  <Button onClick={() => setShowBoardForm(true)} sx={{ m: 0, p: 0}}>
                    <BoardStub />
                  </Button>
                </Tooltip>
              </Grid>
            </Grid>

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

      let boards: any = await findProjectBoards(project.id)

      boards = boards.map((b: any) => ({
        id: b._id,
        title: b.title,
        project: b.project
      })
      )

      return {props: {project, member, boards}}
    }
  }

  return {redirect: {destination: "/", permanent: false}}
}

