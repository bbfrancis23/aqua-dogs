import { Box, Card, CardContent, CardHeader, styled,
  useTheme, IconButton } from "@mui/material"
import { Item } from "../../interfaces/ItemInterface"

import { Draggable, Droppable } from "react-beautiful-dnd";
import TagBoardCard from "./TagBoardCard";

export interface BoardColListProps {
  tagItemList: any;
  linkPath: string;
  updateBoardFromDataBase: () => void;
}


const TagBoardColList = (props: BoardColListProps) => {

  const {tagItemList, linkPath, updateBoardFromDataBase} = props


  return (
    <Droppable droppableId={tagItemList.tag.id} type="LIST">
      {(dropProvided, dropSnapshot) => (
        <Box {...dropProvided.droppableProps} ref={dropProvided.innerRef}>
          {
            tagItemList.items.map( (i: Item, index:number) => (
              <Draggable key={i.id} draggableId={i.id} index={index}>
                {(dragProvided, dragSnapshot) => (
                  <TagBoardCard
                    updateBoardFromDataBase={() => updateBoardFromDataBase()}
                    linkPath={linkPath} dragProvided={dragProvided} item={i}/>
                )}
              </Draggable>

            ) )
          }</Box>
      )}
    </Droppable>

  )
}

export default TagBoardColList