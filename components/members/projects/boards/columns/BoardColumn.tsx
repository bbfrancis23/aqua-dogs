import { useContext } from "react";

import { Box, Typography} from "@mui/material";

import { Draggable } from "react-beautiful-dnd";

import { Column } from "@/interfaces/Column";
import { Member } from "@/interfaces/MemberInterface";

import Permission, { PermissionCodes } from "@/ui/permission/Permission";

import ColumnList from "./ColumnList";
import CreateItemForm from "./items/forms/CreateItemForm";

import { ProjectContext } from "pages/member/projects/[projectId]/boards/[boardId]";

export interface BoardColumnProps {
  index: number;

  column: Column;
  member: Member;
}

export const BoardColumn = (props: BoardColumnProps) => {
  const {index, column, member,} = props;

  const {project} = useContext(ProjectContext)

  return (
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

            <ColumnList column={column} member={member} />
            <Permission code={PermissionCodes.PROJECT_ADMIN} project={project} member={member}>
              <CreateItemForm column={column} member={member} />
            </Permission>

          </Box>
        </Box>
      )}
    </Draggable>
  )
}

export default BoardColumn