import { useState, useContext } from "react";
import Link from "next/link"

import { Card, CardHeader, IconButton, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

import { Column } from "@/interfaces/Column";
import { Member } from "@/interfaces/MemberInterface";
import { Item } from "@/interfaces/ItemInterface";
import { ProjectContext } from "@/interfaces/ProjectInterface";

import Permission, { PermissionCodes } from "@/ui/PermissionComponent";

import EditItemForm from "./forms/EditItemForm";


export interface ColumnListProps {
  column: Column;
  member: Member;
  item: Item;
}

const ColumnListItem = (props: ColumnListProps) => {
  const {column, member, item} = props

  const {project} = useContext(ProjectContext)

  const [showForm, setShowForm] = useState<boolean>(false)
  const [showEdit, setShowEdit] = useState<boolean>(false)

  const handleCloseForm = () => {
    setShowForm(false);
  }

  return (

    <Card onMouseEnter={() => setShowEdit(true)} onMouseLeave={() => setShowEdit(false)}>
      <CardHeader
        title={
          showForm ?
            <EditItemForm column={column} member={member} item={item}
              closeForm={() => handleCloseForm()}/>
            : <Link href={`/member/projects/${project.id}/items/${item.id}`}
              style={{textDecoration: "none"}}><Typography>{item.title}</Typography></Link>
        }

        action={
          (showEdit && !showForm) && (
            <Permission code={PermissionCodes.ITEM_OWNER} item={item} member={member}>
              <IconButton size={'small'} onClick={() => setShowForm(true) }>
                <EditIcon sx={{ fontSize: '1em'}}/>
              </IconButton>
            </Permission>)
        }
        sx={{p: showForm ? 1 : 2}}
      />
    </Card>
  )

}

export default ColumnListItem

// QA: Brian Francisc 8-12-23