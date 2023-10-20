import { useState, useContext } from "react"
import { GetServerSideProps } from "next"
import Head from "next/head"
import { getSession } from "next-auth/react"
import { Box, Stack } from "@mui/material"
import { resetServerContext } from "react-beautiful-dnd"
import { findMember } from "@/mongo/controls/member/memberControls"
import { findProject, findProjectBoards } from "@/mongo/controls/member/project/projectControls"
import findPublicBoard from "@/mongo/controls/member/project/board/findPublicBoard"
import { Board, BoardToolbar, ProjectBoard, BoardContext, BoardThemeBG } from "@/react/board"
import { Project, ProjectContext} from "@/react/project/"
import { Member, MemberContext } from "@/react/members"
import {MemberItemDialog} from "@/react/item/"
import {CreateColumnForm} from "@/react/column/"
import { unAuthRedirect } from "@/error"
import { Permission, PermissionCodes, permission } from "@/fx/ui"
import { FxThemeContext } from "@/fx/theme"
export interface BoardPage {
  project: Project;
  projectBoards: Board[];
  board: Board;
  member: Member;
}

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

export const Page = (props: BoardPage) => {

  const [member, setMember] = useState<Member>(props.member)
  const {fxTheme} = useContext(FxThemeContext)

  const [project, setProject] = useState<Project>(props.project)
  const [board, setBoard] = useState<Board>(props.board)

  const [itemDialogIsOpen, setItemDialogIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<null | string>('')

  //TODO: Put ItemDialog in hook readablity low priorty

  return (
    <ProjectContext.Provider value={{project, setProject, setItemDialogIsOpen, setSelectedItem}}>
      <BoardContext.Provider value={{board, setBoard}}>
        <Head>
          <title>{`${board.title}- Strategy Fx - Board Page`}</title>
        </Head>
        <MemberContext.Provider value={{member, setMember}}>
          <BoardThemeBG>
            <BoardToolbar projectBoards={props.projectBoards}/>
            <Stack spacing={2}
              sx={{ p: 2, width: '100%', overflow: 'auto', height: 'calc(100vh - 124px)' }} >
              <ProjectBoard member={member}/>
            </Stack>
          </BoardThemeBG>
          <MemberItemDialog
            dialogIsOpen={itemDialogIsOpen}
            closeDialog={() => setItemDialogIsOpen(false)} itemId={selectedItem}/>
        </MemberContext.Provider>
      </BoardContext.Provider>
    </ProjectContext.Provider>
  )
}

export default Page
// QA: Brian Francisc 10-20-23
