

import { useState } from "react"
import { useSnackbar } from "notistack"

import {useSession} from "next-auth/react"

import {FormikProvider, useFormik, Form} from "formik"
import * as Yup from "yup"
import axios from "axios"
import { Alert, Box, Stack, TextField, Typography } from "@mui/material"
import { LoadingButton } from "@mui/lab"


const foundOrgSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
})


export default function OrgForm(){
  const {enqueueSnackbar} = useSnackbar()

  const [formError, setFormError] = useState<string>("")

  const {data: session, status} = useSession()

  const formik = useFormik({
    initialValues: {
      title: ''
    },
    validationSchema: foundOrgSchema,
    onSubmit: (data) => {
      axios.post(
        "/api/org",
        {title: data.title},
      )
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Created ){
            enqueueSnackbar("Organization create", {variant: "success"})
          }
        })
        .catch((error) => {
          formik.setSubmitting(false)
          setFormError(error.response.data.message)
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
              <Stack spacing={3} sx={{width: "300px"}}>
                { formError && (<Alert severity="error">{formError}</Alert>) }
                <TextField
                  fullWidth
                  size="small"
                  label="Title"
                  {...getFieldProps('title')}
                  error={Boolean(touched && errors.title)}
                  helperText={touched && errors.title}
                />
                <LoadingButton
                  color="success"
                  disabled={!(isValid && formik.dirty)}
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  Found Organization
                </LoadingButton>
              </Stack>
            </Form>
          </FormikProvider>
        </>
      )}
    </Box>
  )
}