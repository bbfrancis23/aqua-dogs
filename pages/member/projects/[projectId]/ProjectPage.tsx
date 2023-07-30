import { useState } from "react";

import { GetServerSideProps, InferGetServerSidePropsType, Redirect } from "next";
import { getSession } from "next-auth/react";
import router from "next/router";

import { Box, Button, Grid, Stack, Typography } from "@mui/material";

import { Project, ProjectContext } from "@/interfaces/ProjectInterface";
import { Member, getValidMember } from "@/interfaces/MemberInterface";
import { Board } from "@/interfaces/BoardInterface";

import {findProject} from "@/mongo/controls/member/project/findProject"
import {findProjectBoards} from "@/mongo/controls/member/project/findProjectBoards"

import Permission, { permission, PermissionCodes } from "@/ui/permission/Permission";
import InfoPageLayout from "@/ui/info-page-layout/InfoPageLayout";

import ProjectTitleForm from "@/components/members/projects/forms/ProjectTItleForm";
import ProjectMember from "@/components/members/projects/ProjectMember";
import AddProjectMemberForm from "@/components/members/projects/forms/AddProjectMemberForm";
import CreateBoardForm from "@/components/members/projects/boards/forms/CreateBoardForm";
import BoardStub from "@/components/members/projects/boards/BoardStub";
import { useConfirm } from "material-ui-confirm";
import axios from "axios";
import { useSnackbar } from "notistack";

export type ProjectPage = {
  project: Project;
  member: Member;
  boards: Board[];
}

const unAuthRedirect: Redirect = {destination: "/", permanent: false}

export const getServerSideProps: GetServerSideProps<ProjectPage> = async(context) => {

  const authSession = await getSession({req: context.req})
  const member: Member | false = await getValidMember(authSession)
  if(! member) return {redirect: unAuthRedirect }

  const project: Project = await findProject(context.query.projectId)
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
  const {enqueueSnackbar} = useSnackbar()

  const confirm = useConfirm()

  const [boards, setBoards] = useState<Board[]>(memberPage.boards)
  const [project, setProject] = useState<Project>(memberPage.project)
  const [showBoardForm, setShowBoardForm] = useState<boolean>(false)

  const handleCloseCreateBoardForm = () => { setShowBoardForm(false) }

  const handleArchive = async () => {
    try{
      await confirm({description: `Archive ${project.title}`})
        .then( () => {
          //axios.delete(`/api/projects/${project.id}`)
          enqueueSnackbar(`Archived ${project.title}`, {variant: "success"})
          router.push("/member")
        })
        .catch((e) => enqueueSnackbar('Archiving aborted', {variant: "error"}) )
    }catch(e){ enqueueSnackbar(`Error2  Archiving ${e}`, {variant: "error"}) }
  }


  return (
    <ProjectContext.Provider value={{project, setProject}}>
      <InfoPageLayout title={<ProjectTitleForm project={project}/>}>
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
          <Box>
            <Button variant={'contained'} color="error" onClick={() => handleArchive()}>
            ARCHIVE PROJECT
            </Button>
          </Box>

        </Stack>
      </InfoPageLayout>
    </ProjectContext.Provider>
  )
}
export default Page


