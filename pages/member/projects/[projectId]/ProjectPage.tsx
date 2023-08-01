import { useState } from "react";

import { GetServerSideProps, InferGetServerSidePropsType, Redirect } from "next";
import { getSession } from "next-auth/react";
import router from "next/router";

import { Button, Grid, Stack, Typography } from "@mui/material";

import { Project, ProjectContext } from "@/interfaces/ProjectInterface";
import { Member } from "@/interfaces/MemberInterface";
import { Board } from "@/interfaces/BoardInterface";

import { findProject, findProjectBoards } from "@/mongo/controls/member/project/projectControls";
import { findMember } from "@/mongo/controls/member/memberControls";


import Permission, { permission, PermissionCodes } from "@/ui/PermissionComponent";
import InfoPageLayout from "@/ui/InfoPageLayout";
import ProjectMember from "@/components/members/projects/ProjectMember";
import AddProjectMemberForm from "@/components/members/projects/forms/AddProjectMemberForm";
import CreateBoardForm from "@/components/members/projects/boards/forms/CreateBoardForm";
import BoardStub from "@/components/members/projects/boards/BoardStub";
import ProjectEditTitleForm from "@/components/members/projects/forms/ProjectEditTitleForm";

import ArchiveProjectForm from "@/components/members/projects/forms/ArchiveProjectForm";


export type ProjectPage = {
  project: Project;
  member: Member;
  boards: Board[];
}

const unAuthRedirect: Redirect = {destination: "/", permanent: false}

export const getServerSideProps: GetServerSideProps<ProjectPage> = async(context) => {

  const authSession = await getSession({req: context.req})

  if(! authSession) return {redirect: unAuthRedirect }

  const member: Member | false = await findMember(authSession?.user?.email)
  if(! member) return {redirect: unAuthRedirect }

  if( typeof context.query.projectId !== "string" ) return {redirect: unAuthRedirect}
  const projectId: string = context?.query?.projectId as string

  const project: Project = await findProject(projectId)

  const hasPermission = permission({code: PermissionCodes.PROJECT_MEMBER, member, project})
  if(! hasPermission){ return {redirect: unAuthRedirect} }

  let boards: Board[] = await findProjectBoards(project.id)

  boards = boards.map((b: Board) => ({
    id: b.id,
    title: b.title,
    columns: b.columns
  }))
  return {props: {project, member, boards}}

}

const Page = (memberPage: InferGetServerSidePropsType<typeof getServerSideProps> ) => {

  const {member} = memberPage

  const [boards, setBoards] = useState<Board[]>(memberPage.boards)
  const [project, setProject] = useState<Project>(memberPage.project)
  const [showBoardForm, setShowBoardForm] = useState<boolean>(false)

  const handleCloseCreateBoardForm = () => { setShowBoardForm(false) }

  return (
    <ProjectContext.Provider value={{project, setProject}}>
      <InfoPageLayout title={<ProjectEditTitleForm project={project}/>}>
        <Stack spacing={3}>
          <Typography variant="h4">Members</Typography>
          <Stack spacing={1} sx={{ pr: 3}}>
            <Grid container spacing={1} sx={{ m: 0}}>
              { project?.leader && (
                <Grid item xs={12} sm={6} md={4}>
                  <ProjectMember sessionMember={member} member={project.leader}
                    type={PermissionCodes.PROJECT_LEADER} />
                </ Grid>
              )}
              <Grid container spacing={1} sx={{ m: 0}}>
                {project?.admins?.map( (m:Member) => (
                  <Grid item xs={12} sm={6} md={4} key={m.id}>
                    <ProjectMember member={m} type={PermissionCodes.PROJECT_ADMIN}
                      sessionMember={member} key={m.id} />
                  </Grid>
                ))}
              </Grid>
              <Grid container spacing={1} sx={{ m: 0}}>
                { project?.members?.map( (m:Member) => (
                  <Grid item xs={12} sm={6} md={4} key={m.id}>
                    <ProjectMember member={m} type={PermissionCodes.PROJECT_MEMBER}
                      sessionMember={member} key={m.id} />
                  </Grid>
                ))}
              </Grid>
              <Permission code={PermissionCodes.PROJECT_LEADER} project={project} member={member}>
                <Grid container spacing={1} sx={{ m: 0}}>
                  <Grid item xs={12} sm={6} md={4} > <AddProjectMemberForm />    </Grid>
                </Grid>
              </Permission>
            </Grid>
          </Stack>
          <Typography variant="h4">Boards</Typography>
          { showBoardForm && (
            <Grid container spacing={1} sx={{ m: 0}}>
              <Grid item xs={12} sm={6} md={4} >
                <CreateBoardForm setBoards={(b: Board[]) => setBoards(b)} project={project}
                  closeForm={() => handleCloseCreateBoardForm()}/>
              </Grid>
            </Grid>
          ) }
          <Grid container spacing={1} sx={{pr: 3 }}>
            { boards.map( (b) => (
              <Grid item xs={6} sm={3} md={2} key={b.id}>
                <Button onClick={() => router.push(`/member/projects/${project.id}/boards/${b.id}`)}
                  sx={{ m: 0, p: 0, width: '100%'}}>
                  <BoardStub board={b}/>
                </Button>
              </Grid>
            ))}
            <Grid item xs={6} sm={3} md={2}>
              <Permission code={PermissionCodes.PROJECT_LEADER} project={project} member={member} >
                <Button onClick={() => setShowBoardForm(true)} sx={{ m: 0, p: 0, width: '100%'}}>
                  <BoardStub />
                </Button>
              </Permission>
            </Grid>
          </Grid>
          <Typography variant="h4">Actions</Typography>
          <ArchiveProjectForm member={member}/>

        </Stack>
      </InfoPageLayout>
    </ProjectContext.Provider>
  )
}
export default Page
