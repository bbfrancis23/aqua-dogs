import { createContext, useState } from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { Box, Button, Stack, Tooltip, useTheme } from "@mui/material";
import { resetServerContext } from "react-beautiful-dnd";

import { BoardToolbar } from "@/components/members/projects/boards/BoardToolbar";
import ProjectBoard from "@/components/members/projects/boards/ProjectBoard";
import ColumnStub from "@/components/members/projects/boards/columns/ColStub";
import CreateColForm from "@/components/members/projects/boards/columns/forms/CreateColForm";

import { Board } from "@/interfaces/BoardInterface";
import { Project } from "@/interfaces/ProjectInterface";
import { Member } from "@/interfaces/MemberInterface";

import { findProject } from "@/mongo/controls/member/project/findProject";
import { findProjectBoards } from "@/mongo/controls/member/project/old-findProjectBoards";

import { PermissionCodes, permission } from "@/ui/permission/old-Permission";
import { useSnackbar } from "notistack";
import { findMember } from "@/mongo/controls/member/memberControls";

export interface MemberProjectBoardPageProps {
  project: Project;
  board: Board;
  member: Member;
}

export const ProjectContext = createContext <any>({ project: undefined, setProject: () => {}})
export const BoardContext = createContext <any>({ board: undefined, setBoard: () => {}})

export const MemberProjectBoardPage = (props: MemberProjectBoardPageProps) => {

  const {member} = props

  const theme = useTheme()
  const {enqueueSnackbar} = useSnackbar()

  const [project, setProject] = useState<Project>(props.project)
  const [board, setBoard] = useState<Board>(props.board)
  const [showColForm, setShowColForm] = useState<boolean>(false)


  const handleCloseColForm = () => setShowColForm(false)

  const fxPalette:any = theme.palette

  return (
    <ProjectContext.Provider value={{project, setProject}}>
      <BoardContext.Provider value={{board, setBoard}}>
        <Box
          sx={{background: `url(/images/themes/${fxPalette.name}/hero.jpg)`,
            backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundAttachment: 'fixed',
            backgroundPosition: 'center', width: '100vw', height: 'calc(100vh - 64px)'}} >
          <BoardToolbar />
          { showColForm && (
            <CreateColForm closeForm={() => handleCloseColForm() } />
          )}
          <Stack spacing={2} direction={'row'} sx={{ p: 2, }} >
            <ProjectBoard member={member}/>
            <Box>
              <Tooltip title="Create Column">
                <Button onClick={() => setShowColForm(true)} sx={{ m: 0, p: 0}}>
                  <ColumnStub />
                </Button>
              </Tooltip>
            </Box>
          </Stack>

        </Box>
      </BoardContext.Provider>
    </ProjectContext.Provider>
  )
}

export default MemberProjectBoardPage


export const getServerSideProps:
GetServerSideProps<MemberProjectBoardPageProps> = async(context) => {

  const authSession = await getSession({req: context.req})

  if(!authSession){
    return {redirect: {destination: "/", permanent: false}}
  }


  const member: Member | false = await findMember(authSession?.user?.email)

  if(member){
    const project: any = await findProject(context.query.projectId)

    const hasPermission = permission({code: PermissionCodes.PROJECT_MEMBER, member, project})

    if(hasPermission){

      let boards: any = await findProjectBoards(project.id)


      boards = boards.map((b: any) => ({
        id: b._id,
        title: b.title,
        project: b.project,
        columns: b.columns
      })
      )

      const board = boards.find( (b: any) => b.id === context.query.boardId)
      resetServerContext()
      return {props: {project, member, board}}
    }
  }
  return {redirect: {destination: "/", permanent: false}}
}
