import { useMemo, useState, useContext } from "react";

import { Stack } from "@mui/material";
import { useSnackbar } from "notistack";

import { DragDropContext, Droppable } from "react-beautiful-dnd";

import axios from "axios";

import { ProjectContext } from "@/interfaces/ProjectInterface";
import { BoardContext } from "@/react/board/BoardContext";
import { Member } from "@/react/Member/member-types";
import { Column } from "@/react/column/column-types";

import BoardColumn from "./columns/BoardColumn";

export interface ProjectBoardProps {
  member: Member;
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

  if (source.droppableId === destination.droppableId) {
    let reordered = {...current}
    reordered.items = reorderList(current.items, source.index, destination.index)
    boardCols = { ...boardCols, [source.droppableId]: reordered }
    return boardCols;
  }else{
    current.items.splice(source.index, 1)
    next.items.splice(destination.index, 0, target)
    boardCols = { ...boardCols, [source.droppableId]: current, [destination.droppableId]: next }
  }
  return boardCols
}

export const ProjectBoard = (props: ProjectBoardProps ) => {
  const { member} = props
  const {project} = useContext(ProjectContext)
  const {board} = useContext(BoardContext)
  const [colKeys, setColKeys] = useState<any>();
  const [orderedColKeys, setOrderedColKeys] = useState<string[]>();
  const {enqueueSnackbar} = useSnackbar();

  useMemo( () => {
    let colKeys: any = {};
    board.columns.forEach( (c: Column) =>
      colKeys[c.id] = {title: c.title, id: c.id, items: c.items} )

    setOrderedColKeys(Object.keys(colKeys))
    setColKeys(colKeys)
  }, [board.columns])

  const updateBoardCols = (boardCols: string[]) => {
    setOrderedColKeys(boardCols)

    axios.patch(`/api/members/projects/${project.id}/boards/${board.id}`, {columns: boardCols})
      .then((res) => {
        enqueueSnackbar(`Columns Reordered `, {variant: "success"})
      })
      .catch((e:string) => {
        enqueueSnackbar(`Error Moving Columns: ${e}`, {variant: "error"})
      })
  }

  const onDragEnd = async (result: any) => {
    if(!result.destination) {
      return
    }
    const source = result.source;
    const destination = result.destination;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return
    }

    if (result.type === 'COLUMN') {
      const redorder: string[] = reorderList(orderedColKeys, source.index, destination.index)
      updateBoardCols(redorder)
      return
    }

    const boardCols:any = await reorderBoard({boardCols: colKeys, source, destination})

    axios.patch(`/api/members/projects/${project.id}/boards/${board.id}`, {boardCols} )
      .catch((e:string) => {
        console.log(`Error: ${e}`)
      })

    setColKeys(boardCols)
  }


  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="board"
        type="COLUMN"
        direction="horizontal"
      >
        { (provided) => (
          <Stack direction={'row'} spacing={1}
            ref={provided.innerRef} {...provided.droppableProps}>
            { (orderedColKeys && colKeys) && orderedColKeys.map((key: string, index:number) => (
              colKeys[key] && (
                <BoardColumn key={key} member={member} index={index} column={colKeys[key]}/>
              )))
            }
            {provided.placeholder}
          </Stack>
        ) }
      </Droppable>
    </DragDropContext>
  )
}

export default ProjectBoard

// QA: Brian Francisc 8-13-23