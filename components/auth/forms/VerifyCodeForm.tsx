import {useState} from "react"

import {Alert, Box, Stack, TextField} from "@mui/material"
import {LoadingButton} from "@mui/lab"
import {useSnackbar} from "notistack"

import axios from "axios"
import {Form, FormikProvider, useFormik} from "formik"
import * as Yup from "yup"

import {passwordSchema} from "../AuthFormSchema"
import {PasswordTextField} from "../AuthTextFields"

interface VerifyCodeFormProps{
  email?: string,
  closeDialog: () => void;
}


const CodeSchema = Yup.object().shape({
  code: Yup.string().required("Code is required"),
  newPassword: passwordSchema,
})

export default function VerifyCodeForm(props: VerifyCodeFormProps){

  const [serverError, setServerError] = useState<string>("")

  const {email, closeDialog} = props
  const {enqueueSnackbar} = useSnackbar()

  const formik = useFormik({
    initialValues: {
      code: "",
      newPassword: ""
    },
    validationSchema: CodeSchema,
    onSubmit: (data) => {

      formik.setSubmitting(false)

      axios.post(
        "/api/auth/check-code",
        {email, code: data.code, newPassword: data.newPassword}
      )
        .then((res) => {

          formik.setSubmitting(false)
          formik.resetForm()
          if (res.status === axios.HttpStatusCode.Ok){
            setServerError("")
            closeDialog()

            enqueueSnackbar("Password Changed", {variant: "success"})
          }
        })
        .catch((error) => {
          formik.setSubmitting(false)
          setServerError(error.response.data.message)


          if(error.response.status === axios.HttpStatusCode.Locked){
            closeDialog()
            formik.resetForm()
            enqueueSnackbar(error.response.data.message, {variant: "error"})
          }


        })
    }
  })

  const {errors, touched, handleSubmit, getFieldProps, isSubmitting, isValid} = formik

  const closeForm = () => { formik.resetForm(); closeDialog(); setServerError("") }

  return (
    <Box>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3} sx={{width: "100%"}}>
            { serverError && (<Alert severity="error">{serverError}</Alert>) }
            <TextField
              fullWidth
              size="small"
              type="text"
              label="Verification Code"
              {...getFieldProps("code")}
              error={Boolean(touched && errors.code)}
              helperText={touched && errors.code}
            />
            <PasswordTextField
              label="New Password"
              fieldId="newPassword"
              getFieldProps={getFieldProps}
              error={errors.newPassword}
              touched={touched.newPassword}
            />
            <LoadingButton
              color="success"
              disabled={!(isValid && formik.dirty)}
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Change Password
            </LoadingButton>
          </ Stack>
        </ Form>
      </ FormikProvider>
    </ Box>
  )

}