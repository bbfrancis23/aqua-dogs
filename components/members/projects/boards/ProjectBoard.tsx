import { Member } from "../../../../interfaces/MemberInterface";
import { Project } from "../../../../interfaces/ProjectInterface";

import { Board } from "../../../../interfaces/BoardInterface";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Grid } from "@mui/material";
import { useState } from "react";

export interface ProjectBoardProps {
  project: Project;
  board: Board;
  member: Member;
}

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
    //const redorder: string[] = reorderList(orderedTagColKeys, source.index, destination.index);

    // handleSetOrderedTagColKeys(redorder);

    return;
  }

  // const data:any = reorderBoard({boardCols: tagCols, source, destination})
  // setTagCols(data.boardCols)
}

export const ProjectBoard = (props: ProjectBoardProps ) => {
  const {project, board, member} = props

  const [orderedColKeys, setOrderedColKeys] = useState<string[]>();

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
              {/* {
                orderedColKeys &&
                orderedTagColKeys.map((key: string, index:number) => (
                  tagCols[key] && (
                    <TagBoardCol key={key} medCols={medCols} lgCols={lgCols} tagItem={tagCols[key]}
                      index={index} updateBoardFromDataBase={() => updateBoardFromDataBase()}
                      id={key} setItemFormDialogOpen={(id) => setItemFormDialogOpen(id)} />
                  )
                ))} */}
            </Grid>

          )
        }
      </Droppable>
    </DragDropContext>
  )
}

export default ProjectBoard