import { Permission, PermissionCodes } from "@/fx/ui"
import { Board, BoardStub, CreateBoardForm } from "@/react/board"
import { Button, Grid, Typography } from "@mui/material"
import router from "next/router"
import { useContext, useState } from "react"
import { ProjectContext } from "../ProjectContext"
import { MemberContext } from "@/react/members"

interface ProjectBoardsProps { boards: Board[] }

const ProjectBoards = (props: ProjectBoardsProps) => {

  const {project} = useContext(ProjectContext)

  const [boards, setBoards] = useState<Board[]>(props.boards)
  const [showBoardForm, setShowBoardForm] = useState<boolean>(false)
  const {member} = useContext(MemberContext)

  const handleCloseCreateBoardForm = () => { setShowBoardForm(false) }

  return (
    <>
      <Typography variant="h4">Boards</Typography>
      { showBoardForm && (
        <Grid container spacing={1} sx={{ m: 0}}>
          <Grid item xs={12} sm={6} md={4} >
            <CreateBoardForm setBoards={(b: Board[]) => setBoards(b)} project={project}
              closeForm={() => handleCloseCreateBoardForm()}/>
          </Grid>
        </Grid>
      )}
      <Grid container spacing={1} sx={{pr: 3 }}>
        { boards.map( (b) => (
          <Grid item xs={6} sm={3} md={2} key={b.id}>
            <Button
              onClick={() => router.push(`/member/projects/${project.id}/boards/${b.id}`)}
              sx={{ m: 0, p: 0, width: '100%'}}>
              <BoardStub board={b}/>
            </Button>
          </Grid>
        ))}
        <Grid item xs={6} sm={3} md={2}>
          <Permission
            code={PermissionCodes.PROJECT_LEADER} project={project} member={member} >
            <Button onClick={() => setShowBoardForm(true)} sx={{ m: 0, p: 0, width: '100%'}}>
              <BoardStub />
            </Button>
          </Permission>
        </Grid>
      </Grid>
    </>
  )
}

export default ProjectBoards
