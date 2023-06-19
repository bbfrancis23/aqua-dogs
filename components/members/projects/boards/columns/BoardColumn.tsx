import { Dispatch, SetStateAction } from "react";
import { Board } from "../../../../../interfaces/BoardInterface";
import { Column } from "../../../../../interfaces/Column";
import { Box, Card, CardHeader, Grid, Typography, useTheme } from "@mui/material";
import { Draggable } from "react-beautiful-dnd";

export interface BoardColumnProps {
  index: number;
  setBoard: Dispatch<SetStateAction<Board>>;
  column: Column
}

export const BoardColumn = (props: BoardColumnProps) => {
  const {index, setBoard, column} = props;

  const theme = useTheme()

  // return (
  //   <Draggable draggableId={column.id} index={index}>
  //     {(provided: any, snapshot: any) => (
  //       <Grid item key={column.id}
  //         ref={provided.innerRef} {...provided.draggableProps}>
  //         <Card sx={{height: "100%"}}>
  //           <CardHeader
  //             {...provided.dragHandleProps}
  //             title={'yourmom'}
  //             sx={{bgcolor: "primary.main", color: "primary.contrastText",}}

  //           />
  //           some stuff
  //         </Card>
  //       </Grid>
  //     )}
  //   </Draggable>
  // )

  console.log('col', column)

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided:any, snapshot: any) => (
        <Box sx={{ width: '272px', borderRadius: 2, display: 'inline-block' }}
          key={column.id}
          ref={provided.innerRef} {...provided.draggableProps}>
          <Box sx={{display: 'flex', flexDirection: 'column', bgcolor: 'black', borderRadius: 3,
            width: 272}}>
            <Typography sx={{p: 2}} {...provided.dragHandleProps}>
              {column.title}
            </Typography>
          </Box>
        </Box>
      )}
    </Draggable>
  )
}