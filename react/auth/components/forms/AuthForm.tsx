import {useContext, useState} from "react"
import {signIn} from "next-auth/react"
import {Alert, Box, Button, DialogActions, DialogContent, Divider, Stack} from "@mui/material"
import {useSnackbar} from "notistack"
import {Form, FormikProvider, useFormik} from "formik"
import axios from "axios"
import {AuthFormSchema, AuthTextFields, EmailTextField, PasswordTextField} from "@/react/auth"
import GoogleButton from "@/react/components/GoogleButton"
import { AppContext, DialogActions as Actions, AppDialogs } from "@/react/app"
import { SaveButton } from "@/fx/ui"

const AuthForm = () => {

  const {dialogActions} = useContext(AppContext)

  const [loginError, setLoginError] = useState<string>('')
  const {enqueueSnackbar} = useSnackbar()

  const endAuth = () => { dialogActions({type: Actions.Close, dialog: AppDialogs.Auth}) }
  const startReg = () => { endAuth(); dialogActions({type: Actions.Open, dialog: AppDialogs.Reg}) }
  const startForgotPW = () => dialogActions({type: Actions.Open, dialog: AppDialogs.Forgot})

  const onSubmit = async (data: AuthTextFields) => {

    const StatusCode = axios.HttpStatusCode
    const {email, password} = data
    const result = await signIn("credentials", { redirect: false, email, password })

    if( result?.status === StatusCode.Ok && result.error === null ){
      endAuth()
      enqueueSnackbar("You are now Logged In", {variant: "success"})
      return
    }

    const parsedResult = JSON.parse(result?.error ? result.error : '')

    if(parsedResult.status === StatusCode.Locked){
      endAuth()
      enqueueSnackbar("Your account is locked. Please contact support", {variant: "error"})
      return
    }
    if(parsedResult.status === StatusCode.Unauthorized){
      setLoginError("Invalid Credentials"); return
    }
    setLoginError("Unknown Error")
  }

  const formik = useFormik({
    initialValues: { email: "", password: "", },
    validationSchema: AuthFormSchema,
    onSubmit,
  })

  const {errors, touched, handleSubmit, getFieldProps} = formik

  const closeForm = () => { formik.resetForm(); endAuth(); setLoginError("") }

  const emailTextField = {getFieldProps, error: errors.email, touched: touched.email,
    autoFocus: true}
  const passwordTextField = {getFieldProps, error: errors.password, touched: touched.password}

  return (
    <>
      <Box sx={{px: 3}}><GoogleButton /></Box>
      <Divider sx={{px: 3, pt: 3}}>Or with Email and Password</Divider>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={3} sx={{width: "100%"}}>
              { loginError && (<Alert severity="error">{loginError}</Alert>) }
              <EmailTextField {...emailTextField} />
              <PasswordTextField {...passwordTextField} />
              <Button onClick={() => startReg()}>Register New Member</Button>
            </Stack>
            <Stack sx={{width: "100%"}}>
              <Button onClick={() => startForgotPW()} color="inherit">Forgot Password</Button>
            </Stack>
          </DialogContent>
          <DialogActions disableSpacing={false}>
            <Button onClick={closeForm} color="inherit"> CANCEL </Button>
            <SaveButton variant="contained" >Login</SaveButton>
          </DialogActions>
        </Form>
      </FormikProvider>
    </>
  )
}

export default AuthForm
// QA: Brian Francis 10-26-23