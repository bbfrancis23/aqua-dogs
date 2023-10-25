import { Stack } from "@mui/material";

import { Draggable, Droppable } from "react-beautiful-dnd";

import { Item } from "@/react/item/item-types";


import { Column } from "@/react/column/column-types";
import { Member } from "@/react/members/member-types";

// eslint-disable-next-line max-len
import ColumnListItem from "./ColumnListItem";

export interface ColumnListProps {
  column: Column;
  member: Member;
}

const ColumnList = (props: ColumnListProps) => {
  const {column, member} = props


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


                      <ColumnListItem column={column} member={member} item={i}/>
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


// QA: Brian Francisc 8-12-23