import { Dispatch, SetStateAction, useState } from "react";
import { Board } from "@/interfaces/BoardInterface";
import { Column } from "@/interfaces/Column";
import { Box, Button, Card, CardHeader, Stack, Typography, useTheme } from "@mui/material";
import { Draggable } from "react-beautiful-dnd";
import { Member } from "@/interfaces/MemberInterface";
import { Project } from "@/interfaces/ProjectInterface";
import axios from "axios";

import { useSnackbar } from "notistack";
import { CreateItemFormDialog } from "./items/dialogs/CreateItemFormDialog";
import { Item } from "@/interfaces/ItemInterface";

export interface BoardColumnProps {
  index: number;
  setBoard: Dispatch<SetStateAction<Board>>;
  column: Column;
  member: Member;
  project: Project;
  board: Board;
}

export const BoardColumn = (props: BoardColumnProps) => {
  const {index, setBoard, column, member, project, board} = props;

  const [addItemDialogIsOpen, setAddItemDialogIsOpen] = useState<boolean>(false)

  const [item, setItem] = useState<Item>({title: '', id: 'stub'})


  const {enqueueSnackbar} = useSnackbar();

  const handleOpenDialog = () => {
    try {
      axios.post(`/api/projects/${project.id}/boards/${board.id}/columns/${column.id}/items`,
        {scope: 'privare'})
        .then((res) => {

          setItem(res.data.item)
          try {

            axios.post("/api/sections",
              {
                sectiontype: "63b2503c49220f42d9fc17d9",
                content: "", itemId: res.data.item.id, order: 1})
              .then((sectionsRes) => {

                enqueueSnackbar("Created a new Item", {variant: "success"})
                setItem(sectionsRes.data.item)
                setAddItemDialogIsOpen(true)
              })
              .catch((e:any) => {
                enqueueSnackbar(e, {variant: "error"})
              })
          } catch (e:any) {
            enqueueSnackbar(e, {variant: "error"})
          }
        })
        .catch((e:any) => {
          enqueueSnackbar(e, {variant: "error"})
        })
    } catch (e:any) {
      enqueueSnackbar(e, {variant: "error"})
    }

  }

  const handleCloseDialog = () => {
    setAddItemDialogIsOpen(false)

    axios.get(`/api/projects/${project.id}/boards/${board.id}`)
      .then((res) => {
        if(res.status === axios.HttpStatusCode.Ok){
          setBoard(res.data.board)
        }else{
          enqueueSnackbar(`Error getting board info ${res.data.message}`, {variant: "error"})
        }
      }).catch((error) => {
        enqueueSnackbar(`Error getting board info: ${error}`, {variant: "error"})
      })
  }

  const theme = useTheme()


  return (
    <>
      <Draggable draggableId={column.id} index={index}>
        {(provided:any, snapshot: any) => (
          <Box sx={{ width: '272px', borderRadius: 2, display: 'inline-block' }}
            key={column.id} ref={provided.innerRef} {...provided.draggableProps}>
            <Box
              sx={{
                display: 'flex', flexDirection: 'column', bgcolor: 'background.default',
                borderRadius: 3, width: 272, p: 1
              }} >
              <Typography sx={{p: 2}} {...provided.dragHandleProps}>
                {column.title}
              </Typography>
              <Stack spacing={2} direction={'column'} >
                {
                  column.items.map( (i) => (
                    <Card key={i.id}>
                      <CardHeader title={
                        <Typography>{i.title ? i.title : 'DRAFT'}</Typography>
                      } />
                    </Card>
                  ))
                }
              </Stack>

              <Button onClick={() => handleOpenDialog()}>Add item</Button>
            </Box>
          </Box>
        )}
      </Draggable>
      <CreateItemFormDialog dialogIsOpen={addItemDialogIsOpen} item={item}
        setItem={setItem}
        closeDialog={handleCloseDialog} project={project} board={board} column={column}
        member={member} />
    </>
  )
}

