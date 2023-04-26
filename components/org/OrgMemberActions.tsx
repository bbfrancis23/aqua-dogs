import { Box, IconButton, Tooltip } from "@mui/material";

import MakeAdminIcon from '@mui/icons-material/AddModerator';
import RemoveMemberIcon from '@mui/icons-material/PersonOff';
import RemoveAdminIcon from '@mui/icons-material/RemoveModerator';

import axios from "axios";

import PermissionCodes from "../../enums/PermissionCodes";

import Permission from "../../ui/Permission";

import { Org } from "../../interfaces/OrgInterface";

import { useSnackbar } from "notistack"
import { Member } from "../../interfaces/MemberInterface";

export interface OrgMemberActionsProps{
  org: Org;
  setOrg: (org:Org) => void;
  member: Member;
  isAdmin: boolean
}

export default function OrgMemberActions(props: OrgMemberActionsProps){

  const {org, setOrg, member, isAdmin} = props

  const {enqueueSnackbar} = useSnackbar()

  const handleRemoveFromOrg = () => {
    axios.patch(`/api/org/${org.id}`, {removeMember: member.id})
      .then((res) => {
        enqueueSnackbar(`Member ${member.email} removed from Org`, {variant: "success"})
        setOrg(res.data.org)
      }).catch((error) => {
        enqueueSnackbar(`Error removing from Org: ${error}`, {variant: "error"})
      })
  }

  const handleRemoveOrgAdmin = () => {
    axios.patch(`/api/org/${org.id}`, {removeAdmin: member.id})
      .then((res) => {
        enqueueSnackbar(`Member ${member.email} removed org admin`, {variant: "success"})
        setOrg(res.data.org)
      }).catch((error) => {
        enqueueSnackbar(`Error removing admin: ${error}`, {variant: "error"})
      })
  }

  const handleMakeOrgAdmin = () => {
    axios.patch(`/api/org/${org.id}`, {makeAdmin: member.id})
      .then((res) => {
        enqueueSnackbar(`Member ${member.email} made an org admin`, {variant: "success"})
        setOrg(res.data.org)
      }).catch((error) => {
        enqueueSnackbar(`Error making admin: ${error}`, {variant: "error"})
      })
  }

  const getPermissionRoles = () => {
    if(isAdmin){
      return [PermissionCodes.ORG_LEADER]
    }
    return [PermissionCodes.ORG_LEADER, PermissionCodes.ORG_ADMIN]

  }

  return (
    <Permission
      roles={getPermissionRoles()}
      org={org}
    >
      <Box sx={{ position: 'relative', top: '-20px', right: '-20px'}}>
        {
          isAdmin && (
            <>
              <Tooltip title="Remove Admin">
                <IconButton aria-label="Remove Org Admin" size="small"
                  onClick={ () => handleRemoveOrgAdmin()}
                >
                  <RemoveAdminIcon fontSize="small"/>
                </IconButton>
              </Tooltip>
            </>
          )
        }
        {
          !isAdmin && (
            <>
              <IconButton aria-label="Remove from Org" size={'small'}
                onClick={ () => handleRemoveFromOrg()}
              >
                <RemoveMemberIcon fontSize="small"/>
              </IconButton>
              <Tooltip title="Make Admin">
                <IconButton aria-label="Make Org Admin" size="small"
                  onClick={ () => handleMakeOrgAdmin()}
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