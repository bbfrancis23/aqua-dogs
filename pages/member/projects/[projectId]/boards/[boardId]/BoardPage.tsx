import { useState } from "react";

import { GetServerSideProps, Redirect } from "next";
import { getSession } from "next-auth/react";

import { Box, Button, Palette, Stack, useTheme } from "@mui/material";
import { useSnackbar } from "notistack";

import { resetServerContext } from "react-beautiful-dnd";

import { Board, BoardContext } from "@/interfaces/BoardInterface";
import { Project, ProjectContext} from "@/interfaces/ProjectInterface"
import { Member, MemberContext } from "@/interfaces/MemberInterface";

import { findMember } from "@/mongo/controls/member/memberControls";
import { findProject, findProjectBoards } from "@/mongo/controls/member/project/projectControls";
import { PermissionCodes, permission } from "@/ui/PermissionComponent";

import { BoardToolbar } from "@/components/members/projects/boards/BoardToolbar";
import ProjectBoard from "@/components/members/projects/boards/ProjectBoard";
import ColumnStub from "@/components/members/projects/boards/columns/ColStub";
import CreateColForm from "@/components/members/projects/boards/columns/forms/CreateColForm";
import { FxTheme } from "theme/globalTheme";
import findPublicBoard from "@/mongo/controls/member/project/board/findPublicBoard";

export interface BoardPage {
  project: Project;
  board: Board;
  member: Member;
}

const unAuthRedirect: Redirect = {destination: "/", permanent: false}

export const getServerSideProps:
GetServerSideProps<BoardPage> = async(context) => {

  const authSession = await getSession({req: context.req})

  if(!authSession) return {redirect: unAuthRedirect}

  const member: Member | false = await findMember(authSession?.user?.email)

  if(!member) return {redirect: unAuthRedirect}

  if(!context.query.projectId) return {redirect: unAuthRedirect}

  if( typeof context.query.projectId !== "string" ) return {redirect: unAuthRedirect}

  const project: any = await findProject(context.query.projectId)

  const hasPermission = permission({code: PermissionCodes.PROJECT_MEMBER, member, project})

  if(!hasPermission) return {redirect: unAuthRedirect}

  let board: any = await findPublicBoard(context.query.boardId)
  resetServerContext()
  return {props: {project, member, board}}

}

export const Page = (props: BoardPage) => {

  const [member, setMember] = useState<Member>(props.member)

  const theme: FxTheme = useTheme()
  const {enqueueSnackbar} = useSnackbar()

  const [project, setProject] = useState<Project>(props.project)
  const [board, setBoard] = useState<Board>(props.board)
  const [showColForm, setShowColForm] = useState<boolean>(false)

  const handleCloseColForm = () => setShowColForm(false)

  return (
    <ProjectContext.Provider value={{project, setProject}}>
      <BoardContext.Provider value={{board, setBoard}}>
        <MemberContext.Provider value={{member, setMember}}>
          <Box style={{overflow: 'hidden'}}
            sx={{background: `url(/images/themes/${theme.palette.name}/hero.jpg)`,
              overflow: 'hidden', backgroundRepeat: 'no-repeat', backgroundSize: 'cover',
              backgroundAttachment: 'fixed',
              backgroundPosition: 'center', width: '100vw', height: 'calc(100vh - 64px)'}} >
            <BoardToolbar />
            { showColForm && (
              <CreateColForm closeForm={() => handleCloseColForm() } />
            )}
            <Stack spacing={2} direction={'row'}
              sx={{ p: 2, width: '100%', overflow: 'auto', height: 'calc(100vh - 124px)' }} >
              <ProjectBoard member={member}/>
              <Box>
                <Button onClick={() => setShowColForm(true)} sx={{ m: 0, p: 0}}>
                  <ColumnStub />
                </Button>
              </Box>
            </Stack>
          </Box>
        </MemberContext.Provider>
      </BoardContext.Provider>
    </ProjectContext.Provider>
  )
}

export default Page


// QA: Brian Francisc 8-13-23
