import { useContext } from "react"
import { Box, IconButton } from "@mui/material"

import MakeAdminIcon from '@mui/icons-material/AddModerator'
import RemoveMemberIcon from '@mui/icons-material/PersonOff'
import RemoveAdminIcon from '@mui/icons-material/RemoveModerator'
import { useSnackbar } from "notistack"

import axios from "axios"

import Permission, { PermissionCodes } from "fx/ui/PermissionComponent"

import { Member } from "@/react/members/member-types"
import { ProjectContext } from "@/react/project/"

export interface ProjectMemberActionsProps{
  member: Member;
  type: PermissionCodes;
  sessionMember: Member
}

const ProjectMemberActions = (props: ProjectMemberActionsProps) => {

  const { member, type, sessionMember} = props
  const {project, setProject} = useContext(ProjectContext)

  const {enqueueSnackbar} = useSnackbar()

  const handleRemoveFromProject = () => {
    axios.patch(`/api/members/projects/${project.id}`, {removeMember: member.id})
      .then((res) => {
        enqueueSnackbar(`Member ${member.email} removed from Project`, {variant: "success"})
        setProject(res.data.project)
      }).catch((error) => {
        enqueueSnackbar(`Error removing from Project: ${error.response.data.message}`,
          {variant: "error"})
      })
  }

  const handleRemoveProjectAdmin = () => {
    axios.patch(`/api/members/projects/${project.id}`, {removeAdmin: member.id})
      .then((res) => {
        enqueueSnackbar(`Member ${member.email} removed project admin`, {variant: "success"})
        setProject(res.data.project)
      }).catch((error) => {
        enqueueSnackbar(`Error removing admin: ${error.response.data.message}`, {variant: "error"})
      })
  }

  const handleMakeProjectAdmin = () => {
    axios.patch(`/api/members/projects/${project.id}`, {makeAdmin: member.id})
      .then((res) => {
        enqueueSnackbar(`Member ${member.email} made an Project admin`, {variant: "success"})
        setProject(res.data.project)
      }).catch((error) => {
        console.log(error)
        enqueueSnackbar(`Error making admin: ${error.response.data.message}`, {variant: "error"})
      })
  }

  return (
    <Permission code={PermissionCodes.PROJECT_LEADER } project={project} member={sessionMember} >
      <Box >
        { type === PermissionCodes.PROJECT_ADMIN && (
          <IconButton aria-label="Remove Project Admin" size="small"
            onClick={ () => handleRemoveProjectAdmin()} >
            <RemoveAdminIcon fontSize="small"/>
          </IconButton>
        ) }
        { type === PermissionCodes.PROJECT_MEMBER && (
          <>
            <IconButton aria-label="Remove from Project" size={'small'}
              onClick={ () => handleRemoveFromProject()} >
              <RemoveMemberIcon fontSize="small"/>
            </IconButton>
            <IconButton aria-label="Make Project Admin" size="small"
              onClick={ () => handleMakeProjectAdmin()} >
              <MakeAdminIcon fontSize="small"/>
            </IconButton>
          </>
        )}
      </Box>
    </Permission>
  )
}

export default ProjectMemberActions

// QA: Brian Francis 8-10-23