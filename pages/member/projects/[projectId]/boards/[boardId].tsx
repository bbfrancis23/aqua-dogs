import { useState } from "react";
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
import { Member, getValidMember } from "@/interfaces/MemberInterface";

import { findProject } from "@/mongo/controls/member/project/findProject";
import { findProjectBoards } from "@/mongo/controls/member/project/findProjectBoards";

import { PermissionCodes, permission } from "@/ui/permission/Permission";
import ItemFormDialog from "@/components/items/ItemFormDialog";
import FormModes from "enums/FormModes";
import axios from "axios";
import { useSnackbar } from "notistack";

export interface MemberProjectBoardPageProps {
  project: Project;
  board: Board;
  member: Member;
}

export const MemberProjectBoardPage = (props: MemberProjectBoardPageProps) => {

  const {member, project} = props

  const theme = useTheme()
  const {enqueueSnackbar} = useSnackbar()

  const [board, setBoard] = useState<Board>(props.board)
  const [showColForm, setShowColForm] = useState<boolean>(false)


  const handleCloseColForm = () => setShowColForm(false)

  console.log('board', board)

  const fxPalette:any = theme.palette


  return (
    <Box
      sx={{background: `url(/images/themes/${fxPalette.name}/hero.jpg)`,
        backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundAttachment: 'fixed',
        backgroundPosition: 'center', width: '100vw', height: '100vh'}} >
      <BoardToolbar project={project} board={board} setBoard={(b) => setBoard(b)}/>
      { showColForm && (
        <CreateColForm project={project} board={board} setBoard={(b) => setBoard(b) }
          closeForm={() => handleCloseColForm() } />
      )}
      <Stack spacing={2} direction={'row'} sx={{ p: 2}}>
        <ProjectBoard setBoard={(b) => setBoard(b)} board={board} member={member}
          project={project} />
        <Box>
          <Tooltip title="Create Column">
            <Button onClick={() => setShowColForm(true)} sx={{ m: 0, p: 0}}>
              <ColumnStub />
            </Button>
          </Tooltip>
        </Box>
      </Stack>

    </Box>
  )
}

export default MemberProjectBoardPage


export const getServerSideProps:
GetServerSideProps<MemberProjectBoardPageProps> = async(context) => {

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
