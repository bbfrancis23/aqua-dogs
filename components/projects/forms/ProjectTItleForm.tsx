import { useSession } from "next-auth/react";
import { Project } from "../../../interfaces/ProjectInterface";
import { useSnackbar } from "notistack";
import { useState } from "react";


import * as Yup from "yup"
import { Form, FormikProvider, useFormik } from "formik";
import axios from "axios";
import { Box, Button, Skeleton, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";

export interface ProjectTitleFormProps{
  project: Project
}

const TitleSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required"),
})


export const ProjectTitleForm = (props: ProjectTitleFormProps) => {

  const {project} = props


  const {data: session} = useSession()
  const {enqueueSnackbar} = useSnackbar()

  const [title, setTitle] = useState<string>(project.title)
  const [displayTextField, setDisplayTextField] = useState<boolean>(false)

  const formik = useFormik({
    initialValues: { title },
    validationSchema: TitleSchema,
    onSubmit: (data) => {
      axios.patch(`/api/projects/${project.id}`, {title: data.title})
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Ok ){
            enqueueSnackbar("Project Title Updated", {variant: "success"})
            setTitle(data.title)
            setDisplayTextField(false)
          }else{ enqueueSnackbar(res.data.message, {variant: "error"}) }
        }).catch((error) => {

          console.log('there was an error', error)

          formik.setSubmitting(false)
          enqueueSnackbar(`Error updating Project Title: ${error}`, {variant: "error"})
        })
    }
  })

  const {errors, touched, handleSubmit, getFieldProps, isSubmitting, isValid} = formik

  const showTextField = () => {
    if(session && session.user){
      const user:any = session.user
      if(user.id === project.leader?.id) setDisplayTextField(true)
    }
  }

  return (
    <Box >
      {(!displayTextField) &&

        <Typography
          onClick={() => showTextField()}
          sx={{cursor: "pointer", fontSize: '2rem', display: 'contents'}}>
          { title ? title : <Skeleton /> }
        </Typography>
      }
      { displayTextField && (
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <TextField
              size="small"
              label={"Title"}
              {...getFieldProps("title")}
              error={Boolean(touched && errors.title)}
              helperText={touched && errors.title}
              sx={{mr: 1}}
            />
            <LoadingButton
              color="success"
              disabled={!(isValid && formik.dirty)}
              type="submit"
              variant="contained"
              loading={isSubmitting}
              sx={{mr: 1, mb: 1}}
            >
            Save
            </LoadingButton>
            {(title && displayTextField) && (
              <Button onClick={() => setDisplayTextField(false)}>
            Cancel
              </Button>
            )}
          </Form>
        </FormikProvider>
      )}
    </Box>
  )
}
export default ProjectTitleForm