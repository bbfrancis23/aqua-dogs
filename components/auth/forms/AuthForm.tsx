import {useState} from "react"

import {signIn} from "next-auth/react"

import {Alert, Box, Button, DialogActions, DialogContent, Divider, Stack} from "@mui/material"
import {LoadingButton} from "@mui/lab"
import {useSnackbar} from "notistack"

import {Form, FormikProvider, useFormik} from "formik"
import axios from "axios"

import AuthSchema from "../AuthFormSchema"
import {EmailTextField, PasswordTextField} from "../AuthTextFields"
import GoogleButton from "@/components/GoogleButton"


interface AuthFormProps{
  closeDialog: () => void;
  openRegisterDialog: () => void;
  openForgotDialog: () => void;
}

export default function AuthForm(props: AuthFormProps) {

  const [loginError, setLoginError] = useState<string>('')
  const {enqueueSnackbar} = useSnackbar()

  const {closeDialog, openRegisterDialog, openForgotDialog} = props

  const formik = useFormik({
    initialValues: { email: "", password: "", },
    validationSchema: AuthSchema,
    onSubmit: async (data) => {

      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      })

      if( result?.status &&
        result.status === axios.HttpStatusCode.Ok &&
        result.ok === true && result.error === null ){
        closeDialog()
        enqueueSnackbar("You are now Logged In", {variant: "success"})
      }else{

        const parsedResult = JSON.parse(result?.error ? result.error : '')

        if(parsedResult.status === axios.HttpStatusCode.Locked){
          closeDialog();
          enqueueSnackbar("Your account is locked. Please contact support", {variant: "error"})
        }
        if(parsedResult?.status === axios.HttpStatusCode.Unauthorized){
          setLoginError("Invalid Credentials")
        }else{
          setLoginError("Unknown Error")
        }
      }
    },
  })

  const {errors, touched, handleSubmit, getFieldProps, isSubmitting, isValid} = formik

  const closeForm = () => { formik.resetForm(); closeDialog(); setLoginError("") }
  const startRegistration = () => { closeDialog(); openRegisterDialog() }
  const forgotPassword = () => { closeDialog(); openForgotDialog() }

  return (
    <>
      <Box sx={{px: 3}}><GoogleButton /></Box>
      <Divider sx={{px: 3, pt: 3}}>Or with Email and Password</Divider>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={3} sx={{width: "100%"}}>
              { loginError && (<Alert severity="error">{loginError}</Alert>) }
              <EmailTextField getFieldProps={getFieldProps} error={errors.email}
                touched={touched.email} />
              <PasswordTextField getFieldProps={getFieldProps} error={errors.password}
                touched={touched.password} />
            </Stack>
          </DialogContent>
          <DialogActions disableSpacing={false}>
            <Button onClick={closeForm} color="inherit"> CANCEL </Button>
            <LoadingButton color="success" disabled={!(isValid && formik.dirty)}
              type="submit" variant="contained" loading={isSubmitting} >
            Login
            </LoadingButton>
          </DialogActions>
          <DialogContent>
            <Stack sx={{width: "100%"}}>
              <Button onClick={() => startRegistration()}>Register New Member</Button>
              <Button onClick={() => forgotPassword()} color="inherit">Forgot Password</Button>
            </Stack>
          </DialogContent>
        </Form>
      </FormikProvider>
    </>
  )
}
// QA: Brian Francis 08-04-23