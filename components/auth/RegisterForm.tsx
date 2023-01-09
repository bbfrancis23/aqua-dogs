import { LoadingButton } from '@mui/lab'
import { Alert, Button, DialogActions, DialogContent, Stack } from '@mui/material'
import axios from 'axios'
import { Form, FormikProvider, useFormik } from 'formik'
import React, { useState } from 'react'
import AuthSchema from './AuthSchema'

import EmailTextField from './EmailTextField'
import PasswordTextField from './PasswordTextField'

export default function RegisterForm(props: any) {
  const [serverError, setServerError] = useState('')

  const { closeDialog} = props

  const successCode = 201

  const saveToken = (token: any) => {
    localStorage.setItem('token', token)
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: AuthSchema,
    onSubmit: (data) => {
      axios.post(
        'http://localhost:5000/api/users/register',
        { email: data.email, password: data.password },
      )
        .then((res) => {
          saveToken(res.data.token)
          formik.setSubmitting(false)
          if (res.status === successCode && res.statusText === 'Created') closeDialog(); 
        })
        .catch((error) => {
          formik.setSubmitting(false)
          setServerError(error.response.data.message)
        })
    },
  })

  const { errors, touched, handleSubmit, getFieldProps, isSubmitting, isValid } = formik

  const closeForm = () => { formik.resetForm(); closeDialog(); setServerError('') }

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
            Register
          </LoadingButton>
        </DialogActions>
      </Form>
    </FormikProvider>
  )
}