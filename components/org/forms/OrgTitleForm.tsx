
import {FormikProvider, useFormik, Form} from "formik"

import * as Yup from "yup"
import { useState } from "react"
import { useSnackbar } from "notistack"


import {LoadingButton} from "@mui/lab"
import axios from "axios"
import { Box, Button, TextField, Typography } from "@mui/material"

const TitleSchema = Yup.object().shape({
  orgTitle: Yup.string()
    .required("Title is required"),
})


import { useSession } from "next-auth/react";

export default function OrgTitleForm(props: {title: string, id: string, org: any }){

  const {org} = props
  const {data: session, status} = useSession()
  const loading = status === "loading"

  const [title, setTitle] = useState(props.title)

  const {enqueueSnackbar} = useSnackbar()
  const [formError, setFormError] = useState<string>("")
  const [displayTextField, setDisplayTextField] = useState<boolean>(false)

  const formik = useFormik({
    initialValues: {
      orgTitle: title
    },
    validationSchema: TitleSchema,
    onSubmit: (data) => {
      axios.patch(
        `/api/org/${props.id}`,
        {title: data.orgTitle},
      )
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Ok ){
            enqueueSnackbar("Org Title Updated", {variant: "success"})
            setTitle(data.orgTitle)
            setDisplayTextField(false)
          }
        })
        .catch((error) => {
          formik.setSubmitting(false)
          setFormError(error.response.data.message)
        })
    }
  })

  const {errors, touched, handleSubmit, getFieldProps, isSubmitting, isValid} = formik

  const showTextField = () => {

    if(session && session.user){
      const user:any = session.user
      if(user.id === props.org.leader.id){
        setDisplayTextField(true)
      }
    }


  }

  return (
    <Box >
      {(title && !displayTextField) &&
        <Box onClick={() => showTextField()} sx={{cursor: "pointer"}}>
          {title}
        </ Box>
      }

      { displayTextField && (
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>

            <TextField
              size="small"
              label={"Org Title"}
              {...getFieldProps("orgTitle")}
              error={Boolean(touched && errors.orgTitle)}
              helperText={touched && errors.orgTitle}
              sx={{mr: 1}}
            />
            <LoadingButton
              color="success"
              disabled={!(isValid && formik.dirty)}
              type="submit"
              variant="contained"
              loading={isSubmitting}
              sx={{mr: 1}}
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