import { Member } from "../../../../interfaces/MemberInterface";
import { Project } from "../../../../interfaces/ProjectInterface";

import { Board } from "../../../../interfaces/BoardInterface";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Box, Grid, Stack } from "@mui/material";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { Column } from "../../../../interfaces/Column";
import BoardColumn from "./columns/BoardColumn";
import axios from "axios";
import { useSnackbar } from "notistack";

export interface ProjectBoardProps {
  project: Project;
  board: Board;
  setBoard: Dispatch<SetStateAction<Board>>;
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

  // // moving to same list
  if (source.droppableId === destination.droppableId) {
    let reordered = {...current}
    reordered.items = reorderList(current.items, source.index, destination.index);

    boardCols = {
      ...boardCols,
      [source.droppableId]: reordered
    };

    return boardCols;
  }else{
    let destinationList: string[] = [destination.droppableId]


    //destinationList.push(target.id)
    // target.tags.forEach((t: Tag) => {
    //   if( t.id !== source.droppableId){
    //     tags.push(t.id)
    //   }
    // })
    // axios.patch(`/api/items/${target.id}`, {tags} )
    //   .catch((e:string) => {
    //     console.log(`Error: ${e}`)
    //   })

    current.items.splice(source.index, 1)
    next.items.splice(destination.index, 0, target)
    boardCols = {
      ...boardCols,
      [source.droppableId]: current,
      [destination.droppableId]: next
    }

  // for resultkeys -> c
  // ids c.items.map ( i => item.id)
  // patch(/api/projects/${project.is}/boards/${board.id}/columns/${key},
  // {items})
  }

  // // update DB


  return boardCols

};


export const ProjectBoard = (props: ProjectBoardProps ) => {
  const {project, board, member, setBoard} = props

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

    axios.patch(`/api/projects/${project.id}/boards/${board.id}`, {columns: boardCols})
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
      return;
    }


    if (result.type === 'COLUMN') {
      const redorder: string[] = reorderList(orderedColKeys, source.index, destination.index);

      updateBoardCols(redorder);

      return;
    }

    const boardCols:any = await reorderBoard({boardCols: colKeys, source, destination})

    console.log('boardCols', boardCols)

    axios.patch(`/api/projects/${project.id}/boards/${board.id}`, {boardCols} )
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
        {
          (provided) => (
            <Stack direction={'row'} spacing={1}


              ref={provided.innerRef} {...provided.droppableProps}>
              {
                (orderedColKeys && colKeys) &&
                orderedColKeys.map((key: string, index:number) => (
                  colKeys[key] && (

                    <BoardColumn key={key} member={member} project={project} board={board}
                      index={index} setBoard={setBoard} column={colKeys[key]}/>


                  )
                ))
              }
              {provided.placeholder}
            </Stack>

          )
        }
      </Droppable>
    </DragDropContext>
  )
}

export default ProjectBoard