import { ItemContext } from "@/interfaces/ItemInterface";
import { Member, MemberContext } from "@/interfaces/MemberInterface"
import { ProjectContext } from "@/interfaces/ProjectInterface";
import Permission, { PermissionCodes } from "@/ui/PermissionComponent";
import { Box, Button } from "@mui/material";
import axios from "axios";
import { useConfirm } from "material-ui-confirm";
import { useContext } from "react";


import router from "next/router";
import { useSnackbar } from "notistack";

const ArchiveItemForm = () => {

  const {project} = useContext(ProjectContext)
  const {member} = useContext(MemberContext)
  const {item} = useContext(ItemContext)


  const {enqueueSnackbar} = useSnackbar()


  const confirm = useConfirm()

  const handleArchive = async () => {
    try{
      await confirm({description: `Archive ${item?.title}`})
        .then( () => {
          axios.delete(`/api/members/projects/${project?.id}/items/${item?.id}`).then((res) => {
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
          ARCHIVE ITEM
        </Button>
      </Box>
    </Permission>
  );
}

export default ArchiveItemForm