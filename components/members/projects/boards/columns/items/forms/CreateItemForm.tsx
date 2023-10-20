
import { useState, useContext } from "react";

import { Box, Button, IconButton, Paper, TextField } from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from "notistack";

import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup"
import axios from "axios";

import { Column } from "@/react/column/column-types";
import { Member } from "@/react/members/member-types";
import { BoardContext } from "@/react/board/BoardContext";
import { ProjectContext } from "@/react/project/project-types";

import ItemStub from "../ItemStub";
import { LoadingButton } from "@mui/lab";

export interface CreateItemFormProps{
  column: Column;
  member: Member;
}

const createItemSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
})

const CreateItemForm = (props: CreateItemFormProps) => {

  const { column} = props;

  const {project} = useContext(ProjectContext)
  const {board, setBoard} = useContext(BoardContext)

  const {enqueueSnackbar} = useSnackbar()

  const [showForm, setShowForm] = useState<boolean>(false)


  const formik = useFormik({
    initialValues: { title: '' },
    validationSchema: createItemSchema,
    onSubmit: (data) => {

      axios.post(
        `/api/members/projects/${project.id}/boards/${board.id}/columns/${column.id}/items`,
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
              <LoadingButton color="success" disabled={!(isValid && formik.dirty)}
                type="submit" loading={isSubmitting} sx={{minWidth: '0', pl: 2}} >
                <DoneIcon />
              </LoadingButton>

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

// QA: Brian Francisc 8-12-23