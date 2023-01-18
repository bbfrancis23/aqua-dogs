import { LoadingButton } from '@mui/lab'
import { Alert, Button, DialogActions, DialogContent, Stack } from '@mui/material'
import { Form, FormikProvider, useFormik } from 'formik'
import React, { useState } from 'react'
import AuthSchema from './AuthSchema'
import EmailTextField from './EmailTextField'
import PasswordTextField from './PasswordTextField'
import { signIn } from 'next-auth/react'

export default function LoginForm(props: any) {
  const [serverError, setServerError] = useState('')

  const { closeDialog, loginUser, openRegisterDialog } = props

  const successCode = 202


  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: AuthSchema,
    onSubmit: async (data) => {

      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      // axios.post(
      //   'http://localhost:5000/api/users/login',
      //   { email: data.email, password: data.password },
      // )
      //   .then((res) => {
          
      //     formik.setSubmitting(false)
      //     if (res.status === successCode && res.statusText === 'Accepted') {
      //       loginUser()
      //       closeDialog()
      //     }
      //   })
      //   .catch((error) => {
      //     formik.setSubmitting(false)
      //     console.log(error)
      //     setServerError(error.response.data.message)
      //   })
    },
  })

  const { errors, touched, handleSubmit, getFieldProps, isSubmitting, isValid } = formik

  const closeForm = () => { formik.resetForm(); closeDialog(); setServerError('') }

  const startRegistration = () => { closeDialog(); openRegisterDialog() }

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3} sx={{ width: '100%' }}>
           
            { serverError && (<Alert severity="error">{serverError}</Alert>) }
            <EmailTextField
              getFieldProps={getFieldProps}
              error={errors.email}
              touched={touched.email}
            />
            <PasswordTextField
              getFieldProps={getFieldProps}
              error={errors.password}
              touched={touched.password}
            />
          </Stack>
        </DialogContent>
        <DialogActions disableSpacing={false}>
          <Button onClick={closeForm}> CANCEL </Button>
          <LoadingButton
            color="success"
            disabled={!(isValid && formik.dirty)}
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Login
          </LoadingButton>
        </DialogActions>
      </Form>
    </FormikProvider>
  )
}