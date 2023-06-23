import ItemTitleInput from "@/components/ItemTitleInput";
import SectionsInupt from "@/components/SectionsInput";
import { Board } from "@/interfaces/BoardInterface";
import { Column } from "@/interfaces/Column";
import { Item } from "@/interfaces/ItemInterface";
import { Member } from "@/interfaces/MemberInterface";
import { Project } from "@/interfaces/ProjectInterface";
import DraggableDialog from "@/ui/DraggableDialog";
import { Button, DialogActions, DialogContent, Stack, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useSnackbar } from "notistack";
import { Dispatch, SetStateAction } from "react";

export interface CreateItemFormDialogProps {
  dialogIsOpen: boolean;
  closeDialog: () => void;
  item: Item;
  member: Member;
  board: Board;
  project: Project;
  column: Column;
  setItem: Dispatch<SetStateAction<Item>>;
}

export const CreateItemFormDialog = (props: CreateItemFormDialogProps) => {

  const {dialogIsOpen, closeDialog, item, member, board, project, column, setItem} = props;

  const {enqueueSnackbar} = useSnackbar()
  const {data: session, status} = useSession()

  const loading = status === "loading"


  return (

    <DraggableDialog
      dialogIsOpen={dialogIsOpen}
      ariaLabel="add-item"
      title={`ADD ITEM`}
      fullWidth={true}
    >
      <>
        {
          (loading || item?.sections?.length === 0)
            && ( <DialogContent>Loading ...</DialogContent>) }
        {
          (!loading && !session ) &&
            ( <Typography sx={{m: 3}}>Permission Denied</Typography> )
        }
        {
          (!loading && session && item) && (
            <>
              <DialogContent >
                <Stack spacing={3}>
                  <ItemTitleInput
                    item={item}
                    setItem={(i: Item) => setItem(i)}
                  />

                  <SectionsInupt item={item} setItem={(i: Item) => setItem(i)} />
                </Stack>
              </DialogContent>
            </>
          )
        }
      </>

      <DialogActions>

        <Button onClick={() => closeDialog()} >CLOSE</Button>
      </DialogActions>
    </DraggableDialog>
  )
}