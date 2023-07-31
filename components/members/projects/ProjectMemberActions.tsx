import { Box, IconButton, Tooltip } from "@mui/material";

import MakeAdminIcon from '@mui/icons-material/AddModerator';
import RemoveMemberIcon from '@mui/icons-material/PersonOff';
import RemoveAdminIcon from '@mui/icons-material/RemoveModerator';

import axios from "axios";


import Permission, { PermissionCodes } from "../../../ui/permission/old-Permission"

import { useSnackbar } from "notistack"
import { Member } from "../../../interfaces/MemberInterface";
import { Project } from "../../../interfaces/ProjectInterface";

export interface ProjectMemberActionsProps{
  project: Project;
  setProject: (project:Project) => void;
  member: Member;
  type: PermissionCodes;
  sessionMember: Member
}

export default function ProjectMemberActions(props: ProjectMemberActionsProps){

  const {project, setProject, member, type, sessionMember} = props

  const {enqueueSnackbar} = useSnackbar()

  const handleRemoveFromProject = () => {
    axios.patch(`/api/projects/${project.id}`, {removeMember: member.id})
      .then((res) => {
        enqueueSnackbar(`Member ${member.email} removed from Project`, {variant: "success"})
        setProject(res.data.project)
      }).catch((error) => {
        enqueueSnackbar(`Error removing from Project: ${error.response.data.message}`,
          {variant: "error"})
      })
  }

  const handleRemoveProjectAdmin = () => {
    axios.patch(`/api/projects/${project.id}`, {removeAdmin: member.id})
      .then((res) => {
        enqueueSnackbar(`Member ${member.email} removed project admin`, {variant: "success"})
        setProject(res.data.project)
      }).catch((error) => {
        enqueueSnackbar(`Error removing admin: ${error.response.data.message}`, {variant: "error"})
      })
  }

  const handleMakeProjectAdmin = () => {
    axios.patch(`/api/projects/${project.id}`, {makeAdmin: member.id})
      .then((res) => {
        enqueueSnackbar(`Member ${member.email} made an Project admin`, {variant: "success"})
        setProject(res.data.project)
      }).catch((error) => {

        console.log(error)
        enqueueSnackbar(`Error making admin: ${error.response.data.message}`, {variant: "error"})
      })
  }


  return (
    <Permission
      code={type === PermissionCodes.PROJECT_ADMIN
        ? PermissionCodes.PROJECT_LEADER : PermissionCodes.PROJECT_ADMIN}
      project={project} member={sessionMember}
    >
      <Box >
        {
          type === PermissionCodes.PROJECT_ADMIN && (
            <>
              <Tooltip title="Remove Admin">
                <IconButton aria-label="Remove Project Admin" size="small"
                  onClick={ () => handleRemoveProjectAdmin()}
                >
                  <RemoveAdminIcon fontSize="small"/>
                </IconButton>
              </Tooltip>
            </>
          )
        }
        {
          type === PermissionCodes.PROJECT_MEMBER && (
            <>
              <IconButton aria-label="Remove from Project" size={'small'}
                onClick={ () => handleRemoveFromProject()}
              >
                <RemoveMemberIcon fontSize="small"/>
              </IconButton>
              <Tooltip title="Make Admin">
                <IconButton aria-label="Make Project Admin" size="small"
                  onClick={ () => handleMakeProjectAdmin()}
                >
                  <MakeAdminIcon fontSize="small"/>
                </IconButton>
              </Tooltip>
            </>
          )
        }

      </Box>

    </Permission>
  )
}