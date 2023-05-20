import { useMemo, useState } from "react";

import axios from "axios";
import { useSnackbar } from "notistack";

import { Grid } from "@mui/material";
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import { TagItems } from "../../interfaces/TagItems";
import { Tag } from "../../interfaces/TagInterface";

import TagBoardCol from "./TagBoardCol";
import { useSession } from "next-auth/react";


export interface TagBoardProps{
  tagItems: TagItems[];
  tag: Tag;
  setItemFormDialogOpen: (tagId ?:string) => void;
  updateBoardFromDataBase: () => void;
}

const reorderList = (list:any, startIndex:number, endIndex:number):string[] => {

  const result: string[] = Array.from(list);
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
    reordered.items = reorderList(current.items, source.index, destination.index);

    const result = {
      ...boardCols,
      [source.droppableId]: reordered
    };
    return {
      boardCols: result
    };
  }

  // update DB

  let tags: string[] = [destination.droppableId]
  target.tags.forEach((t: Tag) => {
    if( t.id !== source.droppableId){
      tags.push(t.id)
    }
  })
  axios.patch(`/api/items/${target.id}`, {tags} )
    .catch((e:string) => {
      console.log(`Error: ${e}`)
    })

  current.items.splice(source.index, 1)
  next.items.splice(destination.index, 0, target)
  const result = {
    ...boardCols,
    [source.droppableId]: current,
    [destination.droppableId]: next
  }

  return {
    boardCols: result
  }
};


const TagBoard = (props: TagBoardProps) => {

  const {data: session, status} = useSession()
  const {enqueueSnackbar} = useSnackbar()

  const {tagItems, tag, setItemFormDialogOpen, updateBoardFromDataBase} = props

  let medCols = 12;
  let lgCols = 12;

  if(tagItems.length === 2){
    lgCols = 6
  }else if(tagItems.length > 2){
    medCols = 6
    lgCols = 4
  }

  const [tagCols, setTagCols] = useState<any>()
  const [orderedTagColKeys, setOrderedTagColKeys] = useState<string[]>();


  const handleSetOrderedTagColKeys = (boardCols: string[]) => {

    setOrderedTagColKeys(boardCols)

    axios.patch(`/api/tags/${tag.id}`, {tagCols: boardCols})
      .then((res) => {
        setOrderedTagColKeys(boardCols)
      })
      .catch((e:string) => {
        enqueueSnackbar(`Error Moving Columns: ${e}`, {variant: "error"})
      })
  }

  useMemo ( () => {


    const initTagCols = () => {
      let bc:any = {}
      tagItems.forEach( (t) => bc[t.tag.id] = {tag: t.tag, items: t.items})


      setTagCols(bc);

      return bc
    }

    if(tag.tagCols && tag.tagCols.length > 0){
      initTagCols()
      setOrderedTagColKeys(tag.tagCols)
    }else{

      const bc = initTagCols()
      setOrderedTagColKeys(Object.keys(bc))
    }


  }, [tagItems, tag])


  const onDragEnd = (result: any) => {

    if(!session){
      return
    }

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
      const redorder: string[] = reorderList(orderedTagColKeys, source.index, destination.index);

      handleSetOrderedTagColKeys(redorder);

      return;
    }

    const data:any = reorderBoard({boardCols: tagCols, source, destination})


    setTagCols(data.boardCols)

  }

  return (
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
              {
                orderedTagColKeys &&
                orderedTagColKeys.map((key: string, index:number) => (
                  tagCols[key] && (
                    <TagBoardCol key={key} medCols={medCols} lgCols={lgCols} tagItem={tagCols[key]}
                      index={index} updateBoardFromDataBase={() => updateBoardFromDataBase()}
                      id={key} setItemFormDialogOpen={(id) => setItemFormDialogOpen(id)} />
                  )
                ))}
            </Grid>

          )
        }
      </Droppable>
    </DragDropContext>
  )
}

export default TagBoard