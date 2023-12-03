import { useContext, useState } from "react"
import { Stack, Typography } from "@mui/material"
import ChecklistIcon from '@mui/icons-material/Checklist'
import { useSnackbar } from "notistack"
import { ItemContext } from "@/react/item"
import { SectionContext, Section} from "@/react/section"
import {CheckListForm, CheckListTitleForm} from "@/react/checklist"
import { NoPermission, PermissionCodes, Permission} from "@/fx/ui"
import { MemberContext } from "@/react/members"

export interface CheckListSectionProps { section: Section}

export const CheckListSection = ({section}: CheckListSectionProps) => {
  const {member} = useContext(MemberContext)
  const {item, setItem} = useContext(ItemContext)
  const {enqueueSnackbar} = useSnackbar()

  const [editSection, setEditSection] = useState<boolean>(false)


  return (
    <>
      <SectionContext.Provider value={{section, setSection: () => {}}}>
        {editSection && (
          <CheckListTitleForm closeForm={() => setEditSection(false)} />
        )}
        { !editSection && (
          <Stack direction={'row'} spacing={2}>
            <ChecklistIcon />
            <Permission code={PermissionCodes.ITEM_OWNER} item={item} member={member}>
              <Typography onClick={() => setEditSection(true)} >{section.content}</Typography>
            </Permission>
            <NoPermission code={PermissionCodes.ITEM_OWNER} item={item} member={member} >
              <Typography >{section.content}</Typography>
            </NoPermission>
          </Stack>
        )}
        <CheckListForm />

      </SectionContext.Provider>
    </>
  )
}

export default CheckListSection
// QA: Brian Francis 12-03-23