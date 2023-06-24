import { Dispatch, SetStateAction, useState } from "react";

import { Board } from "@/interfaces/BoardInterface";
import { Item } from "@/interfaces/ItemInterface";

import { Draggable, Droppable } from "react-beautiful-dnd";
import { Column } from "@/interfaces/Column";
import { Box, Card, CardHeader, IconButton, Stack, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { CreateItemFormDialog } from "./items/dialogs/CreateItemFormDialog";
import { Project } from "@/interfaces/ProjectInterface";
import { Member } from "@/interfaces/MemberInterface";

export interface ColumnListProps {
  column: Column;
  setBoard: Dispatch<SetStateAction<Board>>;
  project: Project;
  board: Board;
  member: Member;
}

const ColumnList = (props: ColumnListProps) => {
  const {column, setBoard, project, board, member} = props

  const [showEditItem, setShowEditItem] = useState<boolean>(false)
  const [selectedItem, setSelectedItem] = useState(column.items[0])
  const [dialogIsOpen, setDialogIsOpen] = useState(false)

  const handleEditItem = (item: any) => {
    setSelectedItem(item)
    setDialogIsOpen(true)
  }

  return (
    <>
      <Droppable droppableId={column.id} type="LIST" >
        {(dropProvided, dropSnapshot) => (

          <Stack spacing={2} direction={'column'} sx={{minHeight: 5 }}
            {...dropProvided.droppableProps} ref={dropProvided.innerRef}>

            {
              column.items.map( (i: Item, index:number) => (
                <Draggable key={i.id} draggableId={i.id} index={index}>
                  {(dragProvided, dragSnapshot) => (

                    <Card ref={dragProvided.innerRef} {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}
                      onMouseOver={() => setShowEditItem(true)}
                      onMouseOut={() => setShowEditItem(false)}
                    >
                      <CardHeader
                        title={ <Typography>{i.title ? i.title : 'DRAFT'}</Typography> }
                        action={

                          showEditItem && (
                            <IconButton aria-label="edit" onClick={() => handleEditItem(i)}>
                              <EditIcon />
                            </IconButton>
                          )


                        } />
                    </Card>

                  )}
                </Draggable>

              ) )
            }
            {dropProvided.placeholder}
          </Stack>
        )}
      </Droppable>
      <CreateItemFormDialog dialogIsOpen={dialogIsOpen} item={selectedItem}
        setItem={setSelectedItem}
        closeDialog={() => setDialogIsOpen(false)} project={project} board={board} column={column}
        member={member} />
    </>

  )

}

export default ColumnList