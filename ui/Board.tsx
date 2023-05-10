import { useMemo, useState } from "react";
import { TagItems } from "../interfaces/TagItems";

import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Box, Card, CardHeader, Grid, IconButton, List } from "@mui/material";
import { Tag } from "../interfaces/TagInterface";

import AddItemIcon from '@mui/icons-material/PostAdd';
import BoardCol from "./BoardCol";

export interface BoardProps{
  tagItems: TagItems[];
  tag: Tag;
}

const reorder = (list:any, startIndex:number, endIndex:number) => {

  console.log('list', list)

  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const reorderBoard = ({ boardCols, source, destination }:any) => {

  const current = {...boardCols[source.droppableId]};
  const next = {...boardCols[destination.droppableId]};
  const target = current.items[source.index];

  // moving to same list
  if (source.droppableId === destination.droppableId) {
    let reordered = {...current}
    reordered.items = reorder(current.items, source.index, destination.index);

    const result = {
      ...boardCols,
      [source.droppableId]: reordered
    };
    return {
      boardCols: result
    };
  }

  // moving to different list

  // remove from original
  current.items.splice(source.index, 1)
  // TODO remove tag from item
  // insert into next
  next.items.splice(destination.index, 0, target)
  // TODO add tag from item

  const result = {
    ...boardCols,
    [source.droppableId]: current,
    [destination.droppableId]: next
  }

  return {
    boardCols: result
  }
};


const Board = (props: BoardProps) => {

  const {tagItems, tag} = props

  let medCols = 12;
  let lgCols = 12;

  if(tagItems.length === 2){
    lgCols = 6
  }else if(tagItems.length > 2){
    medCols = 6
    lgCols = 4
  }


  const [ordered, setOrdered] = useState<any>({});
  const [boardCols, setBoardCols] = useState<any>()

  useMemo ( () => {

    let boardData:any = {}
    tagItems.forEach( (t) => {

      boardData[t.tag.id] = {tag: t.tag, items: t.items}


    })

    setBoardCols(boardData);
    setOrdered(Object.keys(boardData))

  }, [tagItems, setOrdered, setBoardCols,])

  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([tag.id])
  const [addItemDialogIsOpen, setAddItemDialogIsOpen] = useState<boolean>(false)

  const handleOpenDialog = (tagId?: string ) => {
    if(tagId){

      setSelectedTagIds([tag.id, tagId])
    }
    setAddItemDialogIsOpen(true)
  }

  const onDragEnd = (result: any) => {
    console.log(result)

    if(!result.destination) {
      return
    }

    const source = result.source;
    const destination = result.destination;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (result.type === 'COLUMN') {
      const reorderedorder = reorder(ordered, source.index, destination.index);

      setOrdered(reorderedorder);

      return;
    }

    const data:any = reorderBoard({boardCols, source, destination})

    console.log('data', data)

    setBoardCols(data.boardCols)

  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="board"
          type="COLUMN"
          direction="horizontal"
        >
          {
            (provided) => (
              <Grid
                container spacing={3}
                sx={{ height: "100%"}}
                ref={provided.innerRef} {...provided.droppableProps}>
                {ordered.map((key: string, index:number) => (
                  <BoardCol key={key} medCols={medCols} lgCols={lgCols} tagItem={boardCols[key]}
                    index={index} id={key} />
                ))}
              </Grid>

            )
          }
        </Droppable>
      </DragDropContext>
    </>
  )
}

export default Board