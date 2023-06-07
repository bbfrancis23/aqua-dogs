import { Alert, Box, Button, Stack, TextField} from "@mui/material"
import { useSnackbar } from "notistack";
import { Dispatch, SetStateAction, useState } from "react";
import { useSession } from "next-auth/react";
import { FormikProvider, useFormik, Form } from "formik";


import * as Yup from "yup"
import axios from "axios";
import { LoadingButton } from "@mui/lab";
import { Project } from "../../interfaces/ProjectInterface";


export interface CreateProjectFormProps{
  setProjects: Dispatch<SetStateAction<Project[]>>;
  closeForm: () => void;
}

const createProjectSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
})


const CreateProjectForm = (props: CreateProjectFormProps) => {

  const {setProjects, closeForm} = props

  const {enqueueSnackbar} = useSnackbar()

  const {data: session, status} = useSession()


  const formik = useFormik({
    initialValues: { title: '' },
    validationSchema: createProjectSchema,
    onSubmit: (data) => {
      axios.post(
        "/api/projects",
        {title: data.title},
      )
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Created ){

            console.log(res.data)

            setProjects(res.data.projects)

            enqueueSnackbar("Project created", {variant: "success"})
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
                  label="New Project"
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

export default CreateProjectForm