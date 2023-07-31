import axios from "axios";
import { Tag } from "../../interfaces/TagInterface";
import { Org } from "../../interfaces/OrgInterface";
import { useSnackbar } from "notistack";
import { Dispatch, SetStateAction } from "react";
import Permission, {NoPermission} from "../../ui/old-Permission";
import PermissionCodes from "../../enums/PermissionCodes";
import { Chip } from "@mui/material";
export interface OrgTagProps{
  org: Org;
  tag: Tag;
  setOrg: Dispatch<SetStateAction<Org>>;
}


export default function OrgTag(props: OrgTagProps){
  const {tag, org, setOrg} = props;


  const {enqueueSnackbar} = useSnackbar()

  const handleTagClick = () => {
    // goto org tag page
  }

  const handleTagDelete = ( ) => {
    axios.patch( `/api/org/${org.id}`, {removeTag: tag.id}, )
      .then((res) => {

        if (res.status === axios.HttpStatusCode.Ok ){
          enqueueSnackbar("Org Tag Removed", {variant: "success"})
          setOrg(res.data.org);
        }else{
          enqueueSnackbar(res.data.message, {variant: "error"})
        }
      })
      .catch((error) => {
        enqueueSnackbar(error, {variant: "error"})
      })
  }

  return (
    <>
      <Permission
        roles={[PermissionCodes.ORG_LEADER, PermissionCodes.ORG_ADMIN]} org={org}>
        <Chip key={tag.id}
          label={tag.title}
          onClick={() => handleTagClick()}
          onDelete={() => handleTagDelete()}
          sx={{ ml: 1, mt: 1}}
        />
      </Permission>
      <NoPermission
        roles={[PermissionCodes.ORG_LEADER, PermissionCodes.ORG_ADMIN]} org={org}>
        <Chip key={tag.id}
          label={tag.title}
          onClick={() => handleTagClick()}
          sx={{ ml: 1, mt: 1}}
        />
      </NoPermission>
    </>
  )
}