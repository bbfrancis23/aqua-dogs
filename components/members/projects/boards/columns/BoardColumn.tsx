import { Dispatch, SetStateAction, useState } from "react";
import { Board } from "@/interfaces/BoardInterface";
import { Column } from "@/interfaces/Column";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { Draggable } from "react-beautiful-dnd";
import ItemFormDialog from "@/components/items/ItemFormDialog";
import FormModes from "enums/FormModes";
import { Member } from "@/interfaces/MemberInterface";
import { Project } from "@/interfaces/ProjectInterface";

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

  const [addItemDialogIsOpen, setAddItemDialogIsOpen] = useState<boolean>(false)

  const handleCloseDialog = () => {
    setAddItemDialogIsOpen(false)

    // TODO: recalibrate page

    // axios.get(`/api/project/${project.id}/board/${board.id}/columns/{column.id}/items`)
    //   .then((res) => {
    //     //   if(res.status === axios.HttpStatusCode.Created){
    //     //     setTagItems(getTagItems(tag, res.data.items))
    //     //   }else{
    //     //     enqueueSnackbar(`Error getting Tagged Items1: ${res.data.message}`,
    //     // {variant: "error"})
    //     //   }
    //   }).catch((error) => {
    //     enqueueSnackbar(`Error getting Tagged Items2: ${error}`, {variant: "error"})
    //   })
    // setSelectedTagIds([tag.id])
  }

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
                borderRadius: 3, width: 272
              }} >
              <Typography sx={{p: 2}} {...provided.dragHandleProps}>
                {column.title}
              </Typography>
              <Button onClick={() => setAddItemDialogIsOpen(true)}>Add item</Button>
            </Box>
          </Box>
        )}
      </Draggable>
      <ItemFormDialog mode={FormModes.ADD} dialogIsOpen={addItemDialogIsOpen}
        closeDialog={handleCloseDialog} project={project} board={board} column={column}
        member={member} />
    </>
  )
}