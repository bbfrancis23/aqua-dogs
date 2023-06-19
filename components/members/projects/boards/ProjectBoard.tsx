import { Member } from "../../../../interfaces/MemberInterface";
import { Project } from "../../../../interfaces/ProjectInterface";

import { Board } from "../../../../interfaces/BoardInterface";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Box, Grid, Stack } from "@mui/material";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { Column } from "../../../../interfaces/Column";
import { BoardColumn } from "./columns/BoardColumn";

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

export const ProjectBoard = (props: ProjectBoardProps ) => {
  const {project, board, member, setBoard} = props

  const [colKeys, setcolKeys] = useState<any>();
  const [orderedColKeys, setOrderedColKeys] = useState<string[]>();

  useMemo( () => {

    let colKeys: any = {};

    board.columns.forEach( (c: Column) => colKeys[c.id] = {title: c.title, id: c.id} )

    setOrderedColKeys(Object.keys(colKeys))
    setcolKeys(colKeys)

  }, [board.columns])

  const onDragEnd = (result: any) => {
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

      // handleSetOrderedTagColKeys(redorder);
      setOrderedColKeys(redorder)

      return;
    }

    // const data:any = reorderBoard({boardCols: tagCols, source, destination})
    // setTagCols(data.boardCols)
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