import { useState } from "react";
import { Board } from "../../../../../interfaces/BoardInterface";
import { Project } from "../../../../../interfaces/ProjectInterface";
import { Avatar, Badge,
  Box, Breadcrumbs, Button, IconButton, Toolbar, Typography, useTheme } from "@mui/material";

import Link from "next/link"
import MenuIcon from '@mui/icons-material/Menu';
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { Member, getValidMember } from "../../../../../interfaces/MemberInterface";
import { findProject } from "../../../../../mongo/controls/project/findProject";
import { PermissionCodes, permission } from "../../../../../ui/permission/Permission";
import { findProjectBoards } from "../../../../../mongo/controls/project/findProjectBoards";
import { BoardToolbar } from "../../../../../components/members/projects/boards/BoardToolbar";


export interface MemberProjectBoardPageProps {
  project: Project;
  board: Board;
  member: Member;
}

export const MemberProjectBoardPage = (props: MemberProjectBoardPageProps) => {

  const {member} = props

  const theme = useTheme()

  const [project, setProject] = useState<Project>(props.project);
  const [board, setBoard] = useState<Board>(props.board)

  const fxPalette:any = theme.palette

  return (
    <Box sx={{background: `url(/images/themes/${fxPalette.name}/hero.jpg)`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      backgroundPosition: 'center',
      width: '100vw', height: '100vh'}} >
      <BoardToolbar project={project} board={board} setBoard={(b) => setBoard(b)}/>
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
        project: b.project
      })
      )

      const board = boards.find( (b: any) => b.id === context.query.boardId)

      return {props: {project, member, board}}
    }
  }
  return {redirect: {destination: "/", permanent: false}}
}
