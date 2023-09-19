import React, {useState} from "react"

import {Alert, Box, Button, DialogActions, DialogContent, Stack, useTheme} from "@mui/material"
import {LoadingButton} from "@mui/lab"
import {useSnackbar} from "notistack"

import axios from "axios"
import {Form, FormikProvider, useFormik} from "formik"

import { FxTheme } from "theme/globalTheme"

import AuthSchema from "../AuthFormSchema"

import {EmailTextField, PasswordTextField} from "../AuthTextFields"
import Link from "next/link"

interface RegisterFormProps{
  closeDialog: () => void;
  openAuthDialog: () => void;
}

export default function RegisterForm(props: RegisterFormProps) {


  const fxTheme: FxTheme = useTheme()
  const [formError, setFormError] = useState<string>('')
  const {closeDialog, openAuthDialog} = props

  const {enqueueSnackbar} = useSnackbar()
  const startAuth = () => { closeDialog(); openAuthDialog() }

  const formik = useFormik({
    initialValues: { email: '', password: '', },
    validationSchema: AuthSchema,
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

  const {errors, touched, handleSubmit, getFieldProps, isSubmitting, isValid} = formik

  const closeForm = () => { formik.resetForm(); closeDialog(); setFormError("") }

  const theme: FxTheme = useTheme()
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3} sx={{width: "100%"}}>
            { formError && (<Alert severity="error">{formError}</Alert>) }
            <EmailTextField getFieldProps={getFieldProps} error={errors.email}
              touched={touched.email} />
            <PasswordTextField getFieldProps={getFieldProps} error={errors.password}
              touched={touched.password} />
          </Stack>
        </DialogContent>
        <DialogActions disableSpacing={false}>
          <Button onClick={closeForm} color={'inherit'}> CANCEL </Button>
          <LoadingButton color="success" disabled={!(isValid && formik.dirty)}
            type="submit" variant="contained" loading={isSubmitting} >
            Register
          </LoadingButton>
        </DialogActions>
        <DialogContent>
          <Button onClick={() => startAuth()} color={'inherit'} sx={{ width: '100%'}}>
              Login Existing Member
          </Button>
          <Stack direction={'row'} spacing={1} sx={{p: 1, justifyContent: 'center', width: '100%'}}>

            <Link href={'/privacy-policy'}
              style={{textDecoration: "none", color: theme.palette.text.primary,
                fontSize: '12px'}} >
              Privacy Policy
            </Link>
            <Link href={'/terms-of-use'}
              style={{textDecoration: "none", color: theme.palette.text.primary,
                fontSize: '12px'}} >
              Terms of Use
            </Link>
          </Stack>
        </DialogContent>
      </Form>
    </FormikProvider>
  )
}
// QA: done 8-4-23