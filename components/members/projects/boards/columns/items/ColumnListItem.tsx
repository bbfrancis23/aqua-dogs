import { useState, useContext } from "react";
import Link from "next/link"

import { Card, CardHeader, IconButton, Typography, useTheme } from "@mui/material";

import { Column } from "@/interfaces/ColumnInterface";
import { Member } from "@/interfaces/MemberInterface";
import { Item } from "@/interfaces/ItemInterface";
import { ProjectContext } from "@/interfaces/ProjectInterface";

import EditItemForm from "./forms/EditItemForm";
import { FxTheme } from "theme/globalTheme";


export interface ColumnListProps {
  column: Column;
  member: Member;
  item: Item;
}

const ColumnListItem = (props: ColumnListProps) => {
  const {column, member, item} = props

  const {project} = useContext(ProjectContext)

  const fxTheme: FxTheme = useTheme()

  const [showForm, setShowForm] = useState<boolean>(false)
  // const [showEdit, setShowEdit] = useState<boolean>(false)

  const handleCloseForm = () => {
    setShowForm(false);
  }

  return (

    <Card >
      <CardHeader
        title={
          showForm ?
            <EditItemForm column={column} member={member} item={item}
              closeForm={() => handleCloseForm()}/>
            : <Link href={`/member/projects/${project.id}/items/${item.id}`}
              style={{textDecoration: "none", color: fxTheme.palette.text.primary}}>
              <Typography>{item.title}</Typography></Link>
        }

        // action={
        //   (showEdit && !showForm) && (
        //     <Permission code={PermissionCodes.ITEM_OWNER} item={item} member={member}>
        //       <IconButton size={'small'} onClick={() => setShowForm(true) }>
        //         <EditIcon sx={{ fontSize: '1em'}}/>
        //       </IconButton>
        //     </Permission>)
        // }
        sx={{p: showForm ? 1 : 2}}
      />
    </Card>
  )

}

export default ColumnListItem

// QA: Brian Francisc 8-12-23