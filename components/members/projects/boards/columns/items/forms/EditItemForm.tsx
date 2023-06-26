import { Board } from "@/interfaces/BoardInterface";
import { Column } from "@/interfaces/Column";
import { Member } from "@/interfaces/MemberInterface";
import { Project } from "@/interfaces/ProjectInterface";
import { Dispatch, SetStateAction, useState } from "react";
import { Box, Button, IconButton, Paper, TextField } from "@mui/material";
import { useSnackbar } from "notistack";

import { Form, FormikProvider, useFormik } from "formik";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

import * as Yup from "yup"
import axios from "axios";
import { LoadingButton } from "@mui/lab";
import { Item } from "@/interfaces/ItemInterface";

export interface EditItemFormProps{
  project: Project;
  board: Board;
  column: Column;
  member: Member;
  setBoard: Dispatch<SetStateAction<Board>>;
  item: Item;
  closeForm: () => void;
}

const editItemSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
})

const EditItemForm = (props: EditItemFormProps) => {

  const {project, board, column, member, setBoard, item, closeForm} = props;

  const {enqueueSnackbar} = useSnackbar()


  const formik = useFormik({
    initialValues: { title: item.title },
    validationSchema: editItemSchema,
    onSubmit: (data) => {

      axios.patch(
        `/api/projects/${project.id}/boards/${board.id}/columns/${column.id}/items/${item.id}`,
        {title: data.title},
      )
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Ok ){
            setBoard(res.data.board)

            enqueueSnackbar("Item updated", {variant: "success"})
            formik.resetForm()
            closeForm();
          }
        })
        .catch((error) => {

          formik.setSubmitting(false)
          enqueueSnackbar(error.message, {variant: "error"})
        })
    }
  })

  const handleCloseForm = () => {
    formik.resetForm();
    closeForm()
  }

  const {errors, touched, handleSubmit, getFieldProps, isSubmitting, isValid} = formik


  return (

    <Paper >
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Box sx={{ ml: 1, display: 'flex'}}>
            <TextField size={'small'} label="Edit Title" {...getFieldProps('title')}
              error={Boolean(touched && errors.title)} helperText={touched && errors.title}
              sx={{width: 140}}
            />
            <Box>
              <IconButton color="success" disabled={!(isValid && formik.dirty)}
                type="submit"
                sx={{ml: 1, }} >
                <DoneIcon />
              </IconButton>
              <IconButton onClick={() => handleCloseForm()}>
                <CloseIcon />
              </IconButton>
            </Box>
          </ Box>
        </Form>
      </FormikProvider>
    </Paper>
  )


}

export default EditItemForm