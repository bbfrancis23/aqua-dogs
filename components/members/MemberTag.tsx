import axios from "axios";
import { Tag } from "../../interfaces/TagInterface";
import { Org } from "../../interfaces/OrgInterface";
import { useSnackbar } from "notistack";
import { Dispatch, SetStateAction } from "react";
import Permission, {NoPermission} from "../../ui/Permission";
import PermissionCodes from "../../enums/PermissionCodes";
import { Chip } from "@mui/material";
import { useRouter } from 'next/router';

import EditIcon from "@mui/icons-material/Edit"

export interface MemberTagProps{
  tag: Tag;
}


export default function MemberTag(props: MemberTagProps){
  const {tag} = props;
  const router = useRouter();


  const {enqueueSnackbar} = useSnackbar()

  const handleTagClick = () => {
    router.push(`/member/tags/${tag.id}`)
  }


  return (


    <Chip key={tag.id}
      label={tag.title}
      deleteIcon={<EditIcon />}
      onClick={() => handleTagClick()}
      sx={{ ml: 1, mt: 1}}
    />
  )
}