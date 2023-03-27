import { LoadingButton } from '@mui/lab'
import { Alert, Button, DialogActions, DialogContent, Stack } from '@mui/material'
import axios from 'axios'
import { Form, FormikProvider, useFormik } from 'formik'
import { useSnackbar } from 'notistack'
import React, { useState } from 'react'
import AuthSchema from '../AuthFormSchema'

import {EmailTextField, PasswordTextField} from '../AuthTextFields'

import HttpStatusCodes from '../../../enums/HttpStatusCodes'

interface RegisterFormProps{
  closeDialog: () => void;
  openAuthDialog: () => void;
}

export default function RegisterForm(props: RegisterFormProps) {
  const [serverError, setServerError] = useState('')

  const { closeDialog, openAuthDialog } = props

  const { enqueueSnackbar } = useSnackbar()

  

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: AuthSchema,
    onSubmit: (data) => {
      axios.post(
        '/api/auth/register',
        { email: data.email, password: data.password },
      )
        .then((res) => {
          
          formik.setSubmitting(false)
          if (res.status === HttpStatusCodes.CREATED){
            startAuth();
            enqueueSnackbar('You are now Registered Please Login', {variant: 'success'});
          } 
        })
        .catch((error) => {
          formik.setSubmitting(false)
          setServerError(error.response.data.message)
        })
    },
  })

  const { errors, touched, handleSubmit, getFieldProps, isSubmitting, isValid } = formik

  const closeForm = () => { formik.resetForm(); closeDialog(); setServerError('') }
  const startAuth = () => { closeDialog(); openAuthDialog(); }

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
            <Button onClick={() => startAuth()}>Login Existing Member</Button>       
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