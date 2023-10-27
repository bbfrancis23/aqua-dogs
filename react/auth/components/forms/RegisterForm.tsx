import React, {useContext, useState, } from "react"
import Link from "next/link"
import {Alert, Button, DialogActions, DialogContent, Stack} from "@mui/material"
import {useSnackbar} from "notistack"
import axios from "axios"
import {Form, FormikProvider, useFormik} from "formik"

import {AuthFormSchema, EmailTextField, PasswordTextField} from "@/react/auth"
import { FxThemeContext } from "@/fx/theme"
import { AppContext, DialogActions as Actions, AppDialogs } from "@/react/app"
import { SaveButton } from "@/fx/ui"

const RegisterForm = () => {

  const {dialogActions} = useContext(AppContext)
  const {primary: primaryText} = useContext(FxThemeContext).fxTheme.theme.palette.text
  const [formError, setFormError] = useState<string>('')

  const endReg = () => { dialogActions({type: Actions.Close, dialog: AppDialogs.Reg}) }
  const startAuth = () => { endReg(); dialogActions({type: Actions.Open, dialog: AppDialogs.Auth}) }

  const {enqueueSnackbar} = useSnackbar()

  const formik = useFormik({
    initialValues: { email: '', password: '', },
    validationSchema: AuthFormSchema,
    onSubmit: (data) => {
      axios.post( "/api/auth/register", {email: data.email, password: data.password}, )
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Created){
            startAuth()
            enqueueSnackbar("You are now Registered Please Login", {variant: "success"})
          }
        })
        .catch((error) => {
          formik.setSubmitting(false)
          setFormError(error.response.data.message)
        })
    },
  })

  const {errors, touched, handleSubmit, getFieldProps} = formik

  const closeForm = () => { formik.resetForm(); endReg(); setFormError("") }

  const emailTextField = {getFieldProps, error: errors.email, touched: touched.email}
  const passwordTextField = {getFieldProps, error: errors.password, touched: touched.password}

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3} sx={{width: "100%"}}>
            { formError && (<Alert severity="error">{formError}</Alert>) }
            <EmailTextField {...emailTextField} />
            <PasswordTextField {...passwordTextField} />
            <Button onClick={() => startAuth()} color={'inherit'} sx={{ width: '100%'}}>
              Login Existing Member
            </Button>
          </Stack>
          <Stack direction={'row'} spacing={1} sx={{p: 1, justifyContent: 'center', width: '100%'}}>
            <Link href={'/privacy-policy'} style={{color: primaryText, fontSize: '12px'}}>
              Privacy Policy
            </Link>
            <Link href={'/terms-of-use'} style={{color: primaryText, fontSize: '12px'}} >
              Terms of Use
            </Link>
          </Stack>

        </DialogContent>
        <DialogActions disableSpacing={false}>
          <Button onClick={closeForm} color={'inherit'}> CANCEL </Button>
          <SaveButton variant="contained" >
            Register
          </SaveButton>
        </DialogActions>
      </Form>
    </FormikProvider>
  )
}

export default RegisterForm
// QA: done 10-26-23