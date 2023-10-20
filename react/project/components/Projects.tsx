import { useState } from "react"
import { Project } from "../project-types"
import { Button, Grid, Typography } from "@mui/material"
import CreateProjectForm from "./forms/CreateProjectForm"
import router from "next/router"
import ProjectStub from "./ProjectStub"

interface ProjectsProps {
  projects: Project[]
}

const Projects = (props: ProjectsProps) => {

  const [projects, setProjects] = useState<Project[]>(props.projects)

  const [showProjectForm, setShowProjectForm] = useState<boolean>(false)

  const handleCloseCreateProjectForm = () => { setShowProjectForm(false) }

  return (
    <>
      <Typography variant={'h4'}>Projects:</Typography>
      { showProjectForm && (
        <CreateProjectForm setProjects={(p: Project[]) => setProjects(p)}
          closeForm={handleCloseCreateProjectForm}/> ) }
      <Grid container spacing={0} sx={{pr: 3 }}>
        { projects.map( (p: Project) => (
          <Grid item xs={6} sm={3} md={2} key={p.id} sx={{p: 1}}>
            <Button sx={{ m: 0, p: 0, width: '100%'}}
              onClick={() => router.push(`/member/projects/${p.id}`)} >
              <ProjectStub project={p} />
            </Button>
          </Grid>
        ) ) }
        <Grid item xs={6} sm={3} md={2} sx={{p: 1}}>
          <Button onClick={() => setShowProjectForm(true)} sx={{ m: 0, p: 0, width: '100%'}}>
            <ProjectStub />
          </Button>
        </Grid>
      </Grid>
    </>
  )
}

export default Projects