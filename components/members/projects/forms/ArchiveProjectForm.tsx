import { useContext } from "react";

import router from "next/router";

import { Box, Button } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { useSnackbar } from "notistack";

import axios from "axios";

import { ProjectContext } from "@/interfaces/ProjectInterface";
import { Member } from "@/react/Member/member-types"

import Permission, { PermissionCodes } from "fx/ui/PermissionComponent"


export type ArchiveProjectFormProps = { member: Member}

const ArchiveProjectForm = (props: ArchiveProjectFormProps) => {
  const {member} = props

  const {project} = useContext(ProjectContext)

  const {enqueueSnackbar} = useSnackbar()

  const confirm = useConfirm()

  const handleArchive = async () => {
    try{
      await confirm({description: `Archive ${project.title}`})
        .then( () => {
          axios.delete(`/api/members/projects/${project.id}`).then((res) => {
            enqueueSnackbar(`Archived ${project.title}`, {variant: "success"})
            router.push("/member")
          }).catch((error) => {
            enqueueSnackbar(`Error Archiving Project: ${error.response.data.message}`,
              {variant: "error"})
          })
        })
        .catch((e) => enqueueSnackbar('Archiving aborted', {variant: "error"}) )
    }catch(e){ enqueueSnackbar(`Error2  Archiving ${e}`, {variant: "error"}) }
  }

  return (
    <Permission code={PermissionCodes.PROJECT_LEADER} project={project} member={member} >
      <Box>
        <Button variant={'contained'} color="error" onClick={() => handleArchive()}>
          ARCHIVE PROJECT
        </Button>
      </Box>
    </Permission>
  );

}

export default ArchiveProjectForm

// QA: Brian Francis 8-10-23
