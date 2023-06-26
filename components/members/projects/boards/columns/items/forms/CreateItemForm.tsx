import { Board } from "@/interfaces/BoardInterface";
import { Column } from "@/interfaces/Column";
import { Member } from "@/interfaces/MemberInterface";
import { Project } from "@/interfaces/ProjectInterface";
import { Dispatch, SetStateAction, useState } from "react";
import ItemStub from "../ItemStub";
import { Box, Button, IconButton, Paper, TextField } from "@mui/material";
import { useSnackbar } from "notistack";

import { Form, FormikProvider, useFormik } from "formik";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

import * as Yup from "yup"
import axios from "axios";
import { LoadingButton } from "@mui/lab";

export interface CreateItemFormProps{
  project: Project;
  board: Board;
  column: Column;
  member: Member;
  setBoard: Dispatch<SetStateAction<Board>>;
}

const createItemSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
})

const CreateItemForm = (props: CreateItemFormProps) => {

  const {project, board, column, member, setBoard} = props;

  const {enqueueSnackbar} = useSnackbar()

  const [showForm, setShowForm] = useState<boolean>(false)


  const formik = useFormik({
    initialValues: { title: '' },
    validationSchema: createItemSchema,
    onSubmit: (data) => {

      axios.post(
        `/api/projects/${project.id}/boards/${board.id}/columns/${column.id}/items`,
        {title: data.title},
      )
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Created ){
            setBoard(res.data.board)

            enqueueSnackbar("Item created", {variant: "success"})
            setShowForm(false)
            formik.resetForm()
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
    setShowForm(false);
  }

  const {errors, touched, handleSubmit, getFieldProps, isSubmitting, isValid} = formik

  const ItemForm = (
    <Paper sx={{p: 1, mt: 2, mb: 1}}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Box sx={{ ml: 1, display: 'flex'}}>
            <TextField size={'small'} label="New Item" {...getFieldProps('title')}
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

  return (

    showForm ? ItemForm
      : <Button onClick={() => setShowForm(true)} sx={{display: 'block', p: 0, mt: 2, mb: 1}}>
        <ItemStub />
      </Button>
  )

}

export default CreateItemForm