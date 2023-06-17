import { SetStateAction, useState } from "react";
import { Board } from "../../../../../interfaces/BoardInterface";
import { Project } from "../../../../../interfaces/ProjectInterface";
import { Avatar, Badge,
  Box, Breadcrumbs,
  Button, IconButton, Stack, Toolbar, Tooltip, Typography, useTheme } from "@mui/material";

import Link from "next/link"
import MenuIcon from '@mui/icons-material/Menu';
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { Member, getValidMember } from "../../../../../interfaces/MemberInterface";
import { findProject } from "../../../../../mongo/controls/member/project/findProject";
import { PermissionCodes, permission } from "../../../../../ui/permission/Permission";
import { findProjectBoards } from "../../../../../mongo/controls/member/project/findProjectBoards";
import { BoardToolbar } from "../../../../../components/members/projects/boards/BoardToolbar";
import ProjectBoard from "../../../../../components/members/projects/boards/ProjectBoard";
import ColumnStub from "../../../../../components/members/projects/boards/columns/ColStub";
// eslint-disable-next-line max-len
import CreateColForm from "../../../../../components/members/projects/boards/columns/forms/CreateColForm";


export interface MemberProjectBoardPageProps {
  project: Project;
  board: Board;
  member: Member;
}

export const MemberProjectBoardPage = (props: MemberProjectBoardPageProps) => {

  const {member} = props

  const theme = useTheme()

  console.log(props.board)

  const [project, setProject] = useState<Project>(props.project);
  const [board, setBoard] = useState<Board>(props.board)
  const [showColForm, setShowColForm] = useState<boolean>(true)


  const handleCloseColForm = () => {
    setShowColForm(false)
  }

  const fxPalette:any = theme.palette

  return (
    <>
      <Box sx={{background: `url(/images/themes/${fxPalette.name}/hero.jpg)`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        width: '100vw', height: '100vh'}} >
        <BoardToolbar project={project} board={board} setBoard={(b) => setBoard(b)}/>
        {
          showColForm && (

            <CreateColForm project={project} board={board}
              setBoard={(b) => setBoard(b) } closeForm={() => handleCloseColForm() } />
          )
        }
        <Box>

          <Stack spacing={2} sx={{ p: 2}}>
            <Box>
              <Tooltip title="Create Column">

                <Button onClick={() => setShowColForm(true)} sx={{ m: 0, p: 0}}>

                  <ColumnStub />
                </Button>
              </Tooltip>
            </Box>

            <ProjectBoard board={board} member={member} project={project} />
          </Stack>


        </Box>
      </Box>
    </>
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
        project: b.project
      })
      )

      const board = boards.find( (b: any) => b.id === context.query.boardId)

      return {props: {project, member, board}}
    }
  }
  return {redirect: {destination: "/", permanent: false}}
}
