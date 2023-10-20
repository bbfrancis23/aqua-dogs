
import { useState } from "react";
import { useSession } from "next-auth/react";

import { Box, Button, Skeleton, TextField, Typography, styled } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import SaveIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

import * as Yup from "yup"
import { Form, FormikProvider, useFormik } from "formik";
import axios from "axios";

import { Project } from "@/react/project/";

export interface ProjectTitleFormComponent{
  project: Project
}

const TitleSchema = Yup.object().shape({ title: Yup.string() .required("Title is required")})

const ProjectTitleTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': { fontSize: '3rem' },
}));

export const ProjectTitleForm = (props: ProjectTitleFormComponent) => {

  const {project} = props

  const {data: session} = useSession()
  const {enqueueSnackbar} = useSnackbar()

  const [title, setTitle] = useState<string>(project.title)
  const [displayTextField, setDisplayTextField] = useState<boolean>(false)

  const formik = useFormik({
    initialValues: { title },
    validationSchema: TitleSchema,
    onSubmit: (data) => {
      axios.patch(`/api/members/projects/${project.id}`, {title: data.title})
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Ok ){
            enqueueSnackbar("Project Title Updated", {variant: "success"})
            setTitle(data.title)
            setDisplayTextField(false)
          }else{ enqueueSnackbar(res.data.message, {variant: "error"}) }
        }).catch((error) => {
          formik.setSubmitting(false)
          enqueueSnackbar(`Error updating Project Title: ${error}`, {variant: "error"})
        })
    }
  })

  const {errors, touched, handleSubmit, getFieldProps, isSubmitting, isValid} = formik

  const showTextField = () => {
    if(session && session.user){
      const user:any = session.user
      if(user.id === project.leader?.id)
        setDisplayTextField(true)
    }
  }

  return (
    <Box >
      {(!displayTextField) &&
      <Typography variant={'h2'} noWrap onClick={() => showTextField()}
        sx={{p: 5, pl: 2, fontSize: {xs: '2rem', sm: '3rem'}, width: '100%' }}>
        { title ? title : <Skeleton /> }
      </Typography>
      }
      { displayTextField && (
        <Box sx={{ p: 5, pl: 2}}>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <ProjectTitleTextField fullWidth size="medium" label={"Title"}
                {...getFieldProps("title")} sx={{ fontSize: '3rem'}}
                error={Boolean(touched && errors.title)} helperText={touched && errors.title}
                inputProps={{ maxLength: 26 }} />
              <Box display={{ display: 'flex', justifyContent: "right" }}>
                <LoadingButton color="success" disabled={!(isValid && formik.dirty)}
                  type="submit" loading={isSubmitting} sx={{minWidth: '0'}} >
                  <SaveIcon />
                </LoadingButton>
                {(title && displayTextField) && (
                  <Button
                    onClick={() => setDisplayTextField(!displayTextField)} sx={{minWidth: 0}} >
                    <CloseIcon color={'error'}/>
                  </Button>
                )}
              </Box>
            </Form>
          </FormikProvider>
        </ Box>
      )}
    </Box>
  )
}
export default ProjectTitleForm

// QA: Brian Francis 9-10-23