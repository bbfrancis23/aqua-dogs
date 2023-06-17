import { Dispatch, SetStateAction } from "react";
import { Board } from "../../../../../../interfaces/BoardInterface";
import { Project } from "../../../../../../interfaces/ProjectInterface";


import * as Yup from "yup"
import { useSnackbar } from "notistack";
import { useSession } from "next-auth/react";
import { Form, FormikProvider, useFormik } from "formik";
import axios from "axios";
import { Box, Button, Paper, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";

export interface CreateColFormProps{
  project: Project;
  board: Board;
  setBoard: Dispatch<SetStateAction<Board>>;
  closeForm: () => void;
}

const createColSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
})


export const CreateColForm = (props: CreateColFormProps) => {
  const {setBoard, closeForm, project, board} = props

  const {enqueueSnackbar} = useSnackbar()

  const {data: session, status} = useSession()


  const formik = useFormik({
    initialValues: { title: '' },
    validationSchema: createColSchema,
    onSubmit: (data) => {
      axios.post(
        `/api/projects/${project.id}/boards/${board.id}/columns`,
        {title: data.title},
      )
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Created ){


            setBoard(res.data.board)

            enqueueSnackbar("Column created", {variant: "success"})
            closeForm()
            formik.resetForm()
          }
        })
        .catch((error) => {

          formik.setSubmitting(false)
          console.log(error)
          enqueueSnackbar(error.message, {variant: "error"})
        })
    }
  })

  const {errors, touched, handleSubmit, getFieldProps, isSubmitting, isValid} = formik

  return(
    <Box sx={{m: 3, display: 'flex'}}>
      <Paper sx={{p: 1}}>

        { session && (
          <>

            <FormikProvider value={formik}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Box sx={{ ml: 1, display: 'flex'}}>
                  <TextField

                    size={'small'}
                    label="New Column"
                    {...getFieldProps('title')}
                    error={Boolean(touched && errors.title)}
                    helperText={touched && errors.title}
                  />
                  <Box><LoadingButton
                    color="success"
                    disabled={!(isValid && formik.dirty)}
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                    sx={{mr: 1, ml: 1}}
                  >
                Save
                  </LoadingButton>
                  <Button onClick={() => closeForm()} >Cancel</Button></Box>
                </ Box>
              </Form>
            </FormikProvider>
          </>
        )}
      </Paper>
    </Box>
  )
}

export default CreateColForm