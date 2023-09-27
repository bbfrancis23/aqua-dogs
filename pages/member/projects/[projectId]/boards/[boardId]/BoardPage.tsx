import { useState } from "react";

import { GetServerSideProps, Redirect } from "next";
import Head from "next/head"
import { getSession } from "next-auth/react";

import { Box, Stack, useTheme } from "@mui/material";
import { useSnackbar } from "notistack";

import { resetServerContext } from "react-beautiful-dnd";

import { Board, BoardContext } from "@/interfaces/BoardInterface";
import { Project, ProjectContext} from "@/interfaces/ProjectInterface"
import { Member, MemberContext } from "@/interfaces/MemberInterface";

import { findMember } from "@/mongo/controls/member/memberControls";
import { findProject, findProjectBoards } from "@/mongo/controls/member/project/projectControls";
import findPublicBoard from "@/mongo/controls/member/project/board/findPublicBoard";

import { BoardToolbar } from "@/components/members/projects/boards/BoardToolbar";
import ProjectBoard from "@/components/members/projects/boards/ProjectBoard";

import Permission, { PermissionCodes, permission } from "@/ui/PermissionComponent";
import { FxTheme } from "theme/globalTheme";
import CreateColumnForm from "@/components/members/projects/boards/columns/forms/CreateColumnForm";
import MemberItemDialog from "@/components/items/dialogs/MemberItemDialog";

/********** Interfaces Globals and Helpers *********/
export interface BoardPage {
  project: Project;
  projectBoards: Board[];
  board: Board;
  member: Member;
}

const unAuthRedirect: Redirect = {destination: "/", permanent: false}

/********** Backend **********/

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

  let projectBoards: Board[] = await findProjectBoards(project.id)

  return {props: {key: context.params, project, projectBoards, member, board}}

}

/********** Frontend **********/

export const Page = (props: BoardPage) => {

  const [member, setMember] = useState<Member>(props.member)

  const theme: FxTheme = useTheme()
  const {enqueueSnackbar} = useSnackbar()

  const [project, setProject] = useState<Project>(props.project)
  const [board, setBoard] = useState<Board>(props.board)
  const [showColForm, setShowColForm] = useState<boolean>(false)

  const handleCloseColForm = () => setShowColForm(false)

  const [itemDialogIsOpen, setItemDialogIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<null | string>('')

  return (
    <ProjectContext.Provider value={{project, setProject, setItemDialogIsOpen, setSelectedItem}}>
      <BoardContext.Provider value={{board, setBoard}}>
        <Head>
          <title>{`${board.title}- Strategy Fx - Board Page`}</title>
        </Head>
        <MemberContext.Provider value={{member, setMember}}>
          <Box style={{overflow: 'hidden'}}
            sx={{background: `url(/images/themes/${theme.palette.name}/hero.jpg)`,
              overflow: 'hidden', backgroundRepeat: 'no-repeat', backgroundSize: 'cover',
              backgroundAttachment: 'fixed',
              backgroundPosition: 'center', width: '100vw', height: 'calc(100vh - 64px)'}} >
            <BoardToolbar projectBoards={props.projectBoards}/>
            <Stack spacing={2} direction={'row'}
              sx={{ p: 2, width: '100%', overflow: 'auto', height: 'calc(100vh - 124px)' }} >
              <ProjectBoard member={member}/>
              <Permission code={PermissionCodes.PROJECT_LEADER} member={member} project={project}>
                <CreateColumnForm />
              </Permission>
            </Stack>
          </Box>
          <MemberItemDialog dialogIsOpen={itemDialogIsOpen}
            closeDialog={() => setItemDialogIsOpen(false)}
            itemId={selectedItem}/>
        </MemberContext.Provider>
      </BoardContext.Provider>
    </ProjectContext.Provider>
  )
}

export default Page


// QA: Brian Francisc 9-27-23
