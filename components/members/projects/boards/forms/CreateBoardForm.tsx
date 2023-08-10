import { useSession } from "next-auth/react";

import { Box, Button, TextField} from "@mui/material"
import { useSnackbar } from "notistack";
import { FormikProvider, useFormik, Form } from "formik";
import { LoadingButton } from "@mui/lab";
import SaveIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';


import * as Yup from "yup"
import axios from "axios";

import { Board } from "@/interfaces/BoardInterface";
import { Project } from "@/interfaces/ProjectInterface";


export interface CreateBoardFormProps{
  project: Project;
  setBoards: (b: Board[]) => void;
  closeForm: () => void;
}

const createBoardSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
})


const CreateBoardForm = (props: CreateBoardFormProps) => {

  const {setBoards, closeForm, project} = props

  const {enqueueSnackbar} = useSnackbar()

  const {data: session, status} = useSession()


  const formik = useFormik({
    initialValues: { title: '' },
    validationSchema: createBoardSchema,
    onSubmit: (data) => {
      axios.post(
        `/api/members/projects/${project.id}/boards`,
        {title: data.title},
      )
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Created ){

            setBoards(res.data.boards)

            enqueueSnackbar("Board created", {variant: "success"})
            closeForm()
            formik.resetForm()
          }
        })
        .catch((error) => {

          formik.setSubmitting(false)
          enqueueSnackbar(error.message, {variant: "error"})
        })
    }
  })

  const {errors, touched, handleSubmit, getFieldProps, isSubmitting, isValid} = formik

  return(
    <Box >
      { session && (
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', mt: 3}}>
              <TextField fullWidth size={'small'} label="New Board" {...getFieldProps('title')}
                error={Boolean(touched && errors.title)} helperText={touched && errors.title} />
            </Box>
            <Box display={{ display: 'flex', justifyContent: "right" }}>
              <LoadingButton color="success" disabled={!(isValid && formik.dirty)}
                type="submit" loading={isSubmitting} sx={{minWidth: '0'}} >
                <SaveIcon />
              </LoadingButton>
              <Button onClick={() => closeForm()} sx={{ minWidth: '0'}}>
                <CloseIcon color={'error'}/></Button>
            </Box>
          </Form>
        </FormikProvider>
      )}
    </Box>
  )
}

export default CreateBoardForm
// QA: Brian Francis 8-10-23
