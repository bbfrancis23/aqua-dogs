import { useState } from "react"
import { useSession } from "next-auth/react";

import { Box, Button, Skeleton, TextField, Typography } from "@mui/material"
import {LoadingButton} from "@mui/lab"
import { useSnackbar } from "notistack"

import axios from "axios"
import {FormikProvider, useFormik, Form} from "formik"
import * as Yup from "yup"
import { Org } from "../../../interfaces/OrgInterface";

const TitleSchema = Yup.object().shape({
  orgTitle: Yup.string()
    .required("Title is required"),
})

export interface OrgTitleProps {
  org: Org;
}

export default function OrgTitleForm(props: OrgTitleProps){

  const {org} = props
  const {data: session} = useSession()
  const {enqueueSnackbar} = useSnackbar()

  const [title, setTitle] = useState<string>(org.title)
  const [displayTextField, setDisplayTextField] = useState<boolean>(false)

  const formik = useFormik({
    initialValues: { orgTitle: title },
    validationSchema: TitleSchema,
    onSubmit: (data) => {
      axios.patch(`/api/org/${org.id}`, {title: data.orgTitle})
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Ok ){
            enqueueSnackbar("Org Title Updated", {variant: "success"})
            setTitle(data.orgTitle)
            setDisplayTextField(false)
          }else{ enqueueSnackbar(res.data.message, {variant: "error"}) }
        }).catch((error) => {
          formik.setSubmitting(false)
          enqueueSnackbar(`Error updating Org Title: ${error}`, {variant: "error"})
        })
    }
  })

  const {errors, touched, handleSubmit, getFieldProps, isSubmitting, isValid} = formik

  const showTextField = () => {
    if(session && session.user){
      const user:any = session.user
      if(user.id === org?.leader?.id) setDisplayTextField(true)
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