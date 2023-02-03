import React, { useState } from 'react'

import { Alert, Button, DialogActions, DialogContent, Stack, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'

import { signIn } from 'next-auth/react'

import { Form, FormikProvider, useFormik } from 'formik'

import {  VariantType, useSnackbar } from 'notistack';

import AuthSchema from './AuthSchema'
import EmailTextField from './EmailTextField'
import PasswordTextField from './PasswordTextField'

export default function LoginForm(props: any) {

  const [loginError, setLoginError] = useState('')
  const { enqueueSnackbar } = useSnackbar();

  const { closeDialog, openRegisterDialog } = props

  const successCode = 200
  const errorCode = 401


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

      if(result?.status && result.status === successCode && result.ok === true && result.error === null ){
        closeDialog();
        const variant: VariantType = 'success'
        enqueueSnackbar('You are now Logged In', {variant});

      }else{
        if(result?.status === errorCode){
          if(result.error){
            setLoginError(result?.error)
          }else{
            setLoginError('Unknown Error')
          }        
        }else{
          setLoginError('Unknown Error')
        }
      }
    },
  })

  const { errors, touched, handleSubmit, getFieldProps, isSubmitting, isValid } = formik

  const closeForm = () => { formik.resetForm(); closeDialog(); setLoginError('') }

  const startRegistration = () => { closeDialog(); openRegisterDialog() }

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3} sx={{ width: '100%' }}>           
            { loginError && (<Alert severity="error">{loginError}</Alert>) }
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