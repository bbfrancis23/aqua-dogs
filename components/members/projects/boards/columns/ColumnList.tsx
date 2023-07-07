import { Dispatch, SetStateAction, useState } from "react";

import { Board } from "@/interfaces/BoardInterface";
import { Item } from "@/interfaces/ItemInterface";

import { Draggable, Droppable } from "react-beautiful-dnd";
import { Column } from "@/interfaces/Column";
import { Stack } from "@mui/material";
import { Project } from "@/interfaces/ProjectInterface";
import { Member } from "@/interfaces/MemberInterface";
import ColumnListItem from "./items/ColumnListItem";


export interface ColumnListProps {
  column: Column;
  setBoard: Dispatch<SetStateAction<Board>>;
  project: Project;
  board: Board;
  member: Member;
}

const ColumnList = (props: ColumnListProps) => {
  const {column, setBoard, project, board, member} = props


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

                    <div ref={dragProvided.innerRef} {...dragProvided.draggableProps}

                      {...dragProvided.dragHandleProps}>


                      <ColumnListItem column={column} setBoard={setBoard } project={project}
                        board={board} member={member} item={i}/>
                    </ div>

                  )}
                </Draggable>

              ) )
            }
            {dropProvided.placeholder}
          </Stack>
        )}
      </Droppable>

    </>

  )

}

export default ColumnList