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

export interface EditItemTitleFormProps{
  project: Project;
  item: Item;
  closeForm: () => void;
}

const editItemSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
})

const EditTitleItemForm = (props: EditItemTitleFormProps) => {

  const {project, closeForm} = props;

  const [item, setItem] = useState(props.item)

  const {enqueueSnackbar} = useSnackbar()


  const formik = useFormik({
    initialValues: { title: item.title },
    validationSchema: editItemSchema,
    onSubmit: (data) => {

      axios.patch(
        `/api/projects/${project.id}/items/${item.id}`,
        {title: data.title},
      )
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Ok ){
            setItem(res.data.item)

            enqueueSnackbar("Item title updated", {variant: "success"})
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


    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Box sx={{ ml: 1, display: 'flex'}}>
          <TextField size={'medium'} label="Edit Title" {...getFieldProps('title')}
            error={Boolean(touched && errors.title)} helperText={touched && errors.title}
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
  )


}

export default EditTitleItemForm