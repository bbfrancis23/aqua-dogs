import { createContext, useState } from "react";

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";
import router from "next/router";

import { Box, Button, CardContent, CardHeader, Divider,
  Grid, List, Stack, Tooltip, Typography } from "@mui/material";

import { Project, ProjectContext } from "@/interfaces/ProjectInterface";
import { Member, getValidMember } from "@/interfaces/MemberInterface";
import { Board } from "@/interfaces/BoardInterface";

import Permission, { permission, PermissionCodes } from "@/ui/permission/Permission";
import InfoCardContainer from "@/ui/information-card/InfoCardContainer";
import InfoCard from "@/ui/information-card/InfoCard";

import {findProject} from "@/mongo/controls/member/project/findProject"
import {findProjectBoards} from "@/mongo/controls/member/project/findProjectBoards"

import ProjectTitleForm from "@/components/members/projects/forms/ProjectTItleForm";
import ProjectMember from "@/components/members/projects/ProjectMember";
import AddProjectMemberForm from "@/components/members/projects/forms/AddProjectMemberForm";
import CreateBoardForm from "@/components/members/projects/boards/forms/CreateBoardForm";
import BoardStub from "@/components/members/projects/boards/BoardStub";
import InfoPageLayout from "@/ui/info-page-layout/InfoPageLayout";

export type ProjectPage = {
  project: Project;
  member: Member;
  boards: Board[];
}

export const getServerSideProps: GetServerSideProps<ProjectPage> = async(context) => {

  const authSession = await getSession({req: context.req})

  if(!authSession){
    return {redirect: {destination: "/", permanent: false}}
  }


  const member: Member | false = await getValidMember(authSession)

  if(member){
    const project: any = await findProject(context.query.projectId)

    const hasPermission = permission({code: PermissionCodes.PROJECT_MEMBER, member, project})

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

const Page = (memberPage: InferGetServerSidePropsType<typeof getServerSideProps> ) => {

  const {member} = memberPage

  const [boards, setBoards] = useState<Board[] | []>(memberPage.boards)

  const [project, setProject] = useState<Project>(memberPage.project)

  const [showBoardForm, setShowBoardForm] = useState<boolean>(false)

  const handleCloseCreateBoardForm = () => {
    setShowBoardForm(false)
  }

  return (
    <ProjectContext.Provider value={{project, setProject}}>
      <InfoPageLayout title={project.title}>
        <Stack spacing={3} >
          <Typography variant="h5">Members:</Typography>
          <Box sx={{ display: 'flex'}}>

            <List sx={{ bgcolor: 'background.paper' }}>
              { project?.leader && (
                <ProjectMember
                  sessionMember={member}
                  member={project.leader} type={PermissionCodes.PROJECT_LEADER} />
              )}
              <Divider variant="inset" component="li" />
              {project?.admins?.map( (m:Member) => (

                <ProjectMember member={m} type={PermissionCodes.PROJECT_ADMIN}
                  sessionMember={member} key={m.id}
                />
              ))}
              <Divider variant="inset" component="li" />
              { project?.members?.map( (m:Member) => (
                <Box key={m.id}>

                  <ProjectMember
                    sessionMember={member}
                    member={m} type={PermissionCodes.PROJECT_MEMBER}
                  />
                </Box>
              ))}
              <Divider variant="inset" component="li" />

              <Permission
                code={PermissionCodes.PROJECT_ADMIN} project={project} member={member}>
                <AddProjectMemberForm />
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
              <Permission
                code={PermissionCodes.PROJECT_ADMIN} project={project} member={member} >
                <Tooltip title="Create Board">

                  <Button onClick={() => setShowBoardForm(true)} sx={{ m: 0, p: 0}}>
                    <BoardStub />
                  </Button>
                </Tooltip>
              </Permission>

            </Grid>
          </Grid>

        </Stack>
      </InfoPageLayout>
      {/* <InfoCardContainer >
        <InfoCard>
          <CardHeader title={<ProjectTitleForm project={project}/>} />
          <CardContent sx={{ pl: 3}}>

            <Typography variant="h5">Members:</Typography>
            <Stack spacing={3} >
              <Box sx={{ display: 'flex'}}>

                <List sx={{ bgcolor: 'background.paper' }}>
                  { project?.leader && (
                    <ProjectMember
                      sessionMember={member}
                      member={project.leader} type={PermissionCodes.PROJECT_LEADER} />
                  )}
                  <Divider variant="inset" component="li" />
                  {project?.admins?.map( (m:Member) => (

                    <ProjectMember member={m} type={PermissionCodes.PROJECT_ADMIN}
                      sessionMember={member} key={m.id}
                    />
                  ))}
                  <Divider variant="inset" component="li" />
                  { project?.members?.map( (m:Member) => (
                    <Box key={m.id}>

                      <ProjectMember
                        sessionMember={member}
                        member={m} type={PermissionCodes.PROJECT_MEMBER}
                      />
                    </Box>
                  ))}
                  <Divider variant="inset" component="li" />

                  <Permission
                    code={PermissionCodes.PROJECT_ADMIN} project={project} member={member}>
                    <AddProjectMemberForm />
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
                  <Permission
                    code={PermissionCodes.PROJECT_ADMIN} project={project} member={member} >
                    <Tooltip title="Create Board">

                      <Button onClick={() => setShowBoardForm(true)} sx={{ m: 0, p: 0}}>
                        <BoardStub />
                      </Button>
                    </Tooltip>
                  </Permission>

                </Grid>
              </Grid>

            </Stack>
          </CardContent>
        </InfoCard>
      </InfoCardContainer> */}
    </ProjectContext.Provider>

  )
}
export default Page


