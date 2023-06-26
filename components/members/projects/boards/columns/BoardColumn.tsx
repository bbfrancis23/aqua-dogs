import { Dispatch, SetStateAction, useState } from "react";
import { Board } from "@/interfaces/BoardInterface";
import { Column } from "@/interfaces/Column";
import { Box, Button, Card, CardHeader, Stack, Typography, useTheme } from "@mui/material";
import { Draggable } from "react-beautiful-dnd";
import { Member } from "@/interfaces/MemberInterface";
import { Project } from "@/interfaces/ProjectInterface";
import ColumnList from "./ColumnList";
import CreateItemForm from "./items/forms/CreateItemForm";
import Permission, { PermissionCodes } from "@/ui/permission/Permission";

export interface BoardColumnProps {
  index: number;
  setBoard: Dispatch<SetStateAction<Board>>;
  column: Column;
  member: Member;
  project: Project;
  board: Board;
}

export const BoardColumn = (props: BoardColumnProps) => {
  const {index, setBoard, column, member, project, board} = props;


  const theme = useTheme()


  return (
    <>
      <Draggable draggableId={column.id} index={index}>
        {(provided:any, snapshot: any) => (
          <Box sx={{ width: '272px', borderRadius: 2, display: 'inline-block' }}
            key={column.id} ref={provided.innerRef} {...provided.draggableProps}>
            <Box
              sx={{
                display: 'flex', flexDirection: 'column', bgcolor: 'background.default',
                borderRadius: 3, width: 272, p: 1
              }} >
              <Typography sx={{p: 2}} {...provided.dragHandleProps}>
                {column.title}
              </Typography>

              <ColumnList column={column} setBoard={setBoard } project={project}
                board={board} member={member} />
              <Permission code={PermissionCodes.PROJECT_ADMIN} project={project} member={member}>
                <CreateItemForm project={project}
                  board={board} column={column} member={member} setBoard={setBoard } />
              </Permission>

            </Box>
          </Box>
        )}
      </Draggable>
    </>
  )
}

export default BoardColumn