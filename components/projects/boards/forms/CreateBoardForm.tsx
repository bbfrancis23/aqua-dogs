import { Box, Button, TextField} from "@mui/material"
import { useSnackbar } from "notistack";
import { Dispatch, SetStateAction, useState } from "react";
import { useSession } from "next-auth/react";
import { FormikProvider, useFormik, Form } from "formik";


import * as Yup from "yup"
import axios from "axios";
import { LoadingButton } from "@mui/lab";
import { Board } from "../../../../interfaces/BoardInterface";
import { Project } from "../../../../interfaces/ProjectInterface";


export interface CreateBoardFormProps{
  project: Project;
  setBoards: Dispatch<SetStateAction<Board[]>>;
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
        `/api/projects/${project.id}/boards`,
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
          console.log(error)
          enqueueSnackbar(error.message, {variant: "error"})
        })
    }
  })

  const {errors, touched, handleSubmit, getFieldProps, isSubmitting, isValid} = formik

  return(
    <Box sx={{m: 3}}>
      { session && (
        <>

          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Box sx={{ ml: 1, display: 'flex'}}>
                <TextField

                  size={'small'}
                  label="New Board"
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
    </Box>
  )
}

export default CreateBoardForm