
import { ProjectContext } from "@/interfaces/ProjectInterface";
import { useContext } from "react";
import { Box, Button, IconButton, TextField, styled } from "@mui/material";
import { useSnackbar } from "notistack";

import { Form, FormikProvider, useFormik } from "formik";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

import * as Yup from "yup"
import axios from "axios";
import { ItemContext } from "@/interfaces/ItemInterface";
import { LoadingButton } from "@mui/lab";

export interface EditItemTitleFormProps{
  closeForm: () => void;
}

const editItemSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
})

// const TitleTextField = styled(TextField)(({ theme }) => ({
//   'label': { color: theme.palette.secondary.contrastText, },
//   '& .MuiOutlinedInput-root': { color: theme.palette.secondary.contrastText, },
//   '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.secondary.contrastText, }
// }));

const TitleTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': { fontSize: '3rem' },
}));

const EditTitleItemForm = (props: EditItemTitleFormProps) => {

  const {closeForm} = props;

  const {project} = useContext(ProjectContext)
  const {item, setItem} = useContext(ItemContext)

  const {enqueueSnackbar} = useSnackbar()


  const formik = useFormik({
    initialValues: { title: item?.title },
    validationSchema: editItemSchema,
    onSubmit: (data) => {

      axios.patch(
        `/api/members/projects/${project?.id}/items/${item?.id}`,
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
    <Box>
      <Box sx={{ p: 5, pl: 2}}>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>

            <TitleTextField size={'medium'} label="Edit Title" {...getFieldProps('title')}
              error={Boolean(touched && errors.title)}
              helperText={touched && errors.title}

            />
            <Box display={{ display: 'flex', justifyContent: "right" }}>
              <LoadingButton color="success" disabled={!(isValid && formik.dirty)}
                type="submit" loading={isSubmitting} sx={{minWidth: '0'}} >
                <DoneIcon />
              </LoadingButton>
              <Button
                onClick={() => handleCloseForm()} >
                <CloseIcon color={'error'}/>
              </Button>
            </Box>
          </Form>
        </FormikProvider>
      </Box>
    </Box>
  )
}

export default EditTitleItemForm