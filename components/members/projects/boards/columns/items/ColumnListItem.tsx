import { Dispatch, SetStateAction, useState } from "react";

import { Board } from "@/interfaces/BoardInterface";
import { Column } from "@/interfaces/Column";
import { Card, CardHeader, IconButton, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { Project } from "@/interfaces/ProjectInterface";
import { Member } from "@/interfaces/MemberInterface";
import { Item } from "@/interfaces/ItemInterface";
import EditItemForm from "./forms/EditItemForm";
import Permission, { PermissionCodes } from "@/ui/permission/Permission";

export interface ColumnListProps {
  column: Column;
  setBoard: Dispatch<SetStateAction<Board>>;
  project: Project;
  board: Board;
  member: Member;
  item: Item;
}

const ColumnListItem = (props: ColumnListProps) => {
  const {column, setBoard, project, board, member, item} = props

  const [showForm, setShowForm] = useState<boolean>(false)

  const [showEdit, setShowEdit] = useState<boolean>(false)

  const handleCloseForm = () => {
    setShowForm(false);
  }


  return (

    <Card onMouseEnter={() => setShowEdit(true)} onMouseLeave={() => setShowEdit(false)}>
      <CardHeader
        title={
          showForm ? <EditItemForm column={column} setBoard={setBoard } project={project}
            board={board} member={member} item={item} closeForm={() => handleCloseForm()}/>
            : <Typography>{item.title}</Typography>
        }

        action={
          (showEdit && !showForm) && (
            <Permission code={PermissionCodes.PROJECT_ADMIN} project={project} member={member}>
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