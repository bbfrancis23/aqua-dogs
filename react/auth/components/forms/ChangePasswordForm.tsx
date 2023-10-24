import {useState} from "react"
import {useSession} from "next-auth/react"
import {Alert, Box, Stack} from "@mui/material"
import {LoadingButton, LoadingButtonProps} from "@mui/lab"
import axios from "axios"
import {FormikProvider, useFormik, Form} from "formik"
import {useSnackbar} from "notistack"
import * as Yup from "yup"
import {PasswordTextField, AuthFormSchema as pwSchema} from "@/react/auth"

const ChangePasswordFormSchema = Yup.object().shape({ oldPassword: pwSchema, newPassword: pwSchema})

export interface ChangePasswordFormProps { endChangePassword: () => void}

export default function ChangePasswordForm({endChangePassword}: ChangePasswordFormProps){

  const {enqueueSnackbar} = useSnackbar()
  const [formError, setFormError] = useState<string>("")
  const {data: session} = useSession()

  const formik = useFormik({
    initialValues: { oldPassword: "", newPassword: "" },
    validationSchema: ChangePasswordFormSchema,
    onSubmit: (data) => {
      axios.patch( "/api/auth/change-password",
        {oldPassword: data.oldPassword, newPassword: data.newPassword} )
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Ok ){
            enqueueSnackbar("Password changed", {variant: "success"})
            formik.resetForm()
            endChangePassword()
          }
        })
        .catch((error) => {
          formik.setSubmitting(false)
          setFormError(error.response.data.message)
        })
    }
  })

  const {errors, touched, handleSubmit, getFieldProps, isSubmitting, isValid, dirty} = formik

  const oldPassword = {
    label: 'Old Password',
    fieldId: 'oldPassword',
    getFieldProps,
    error: errors.oldPassword,
    touched: touched.oldPassword
  }

  const newPassword = {
    label: 'New Password',
    fieldId: 'newPassword',
    getFieldProps,
    error: errors.newPassword,
    touched: touched.newPassword
  }

  const changePWButton: LoadingButtonProps = {
    disabled: !(isValid && dirty),
    type: "submit",
    variant: "contained",
    loading: isSubmitting,
    color: "success"
  }

  return (
    <Box sx={{m: 3}}>
      { session && (
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3} sx={{width: "300px"}}>
              { formError && (<Alert severity="error">{formError}</Alert>) }
              <PasswordTextField {...oldPassword} />
              <PasswordTextField {...newPassword} />
              <LoadingButton {...changePWButton}>Change Password</LoadingButton>
            </Stack>
          </Form>
        </FormikProvider>
      )}
    </Box>
  )
}

// QA done 10-24-23
