import { List, ListItem, ListItemText, useTheme } from "@mui/material"
import { Item } from "../../interfaces/ItemInterface"


import Link from "next/link"
import { Draggable, Droppable } from "react-beautiful-dnd";

export interface BoardColListProps {
  tagItemList: any;
  linkPath: string;
  index: number
}

const TagBoardColList = (props: BoardColListProps) => {


  const theme = useTheme()
  const {tagItemList, linkPath, index} = props

  return (
    <Droppable droppableId={tagItemList.tag.id} type="LIST">
      {(dropProvided, dropSnapshot) => (
        <List {...dropProvided.droppableProps} ref={dropProvided.innerRef}>
          {
            tagItemList.items.map( (i: Item, index:number) => (
              <Draggable key={i.id} draggableId={i.id} index={index}>
                {(dragProvided, dragSnapshot) => (
                  <ListItem >
                    <ListItemText inset={false}
                      ref={dragProvided.innerRef} {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}
                      primary={
                        <Link
                          href={`${linkPath}/${i.id}`}
                          style={{textDecoration: "none", color: theme.palette.text.primary}} >
                          {i.title}
                        </Link>
                      }>

                    </ListItemText>

                  </ListItem>
                )}
              </Draggable>

            ) )
          }</List>
      )}
    </Droppable>

  )
}

export default TagBoardColList