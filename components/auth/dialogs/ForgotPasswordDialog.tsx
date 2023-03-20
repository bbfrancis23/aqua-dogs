
import { FormikProvider, useFormik,Form } from 'formik';
import React from 'react'
import DraggableDialog from '../../../ui/DraggableDialog'

import * as Yup from 'yup';
import { Button, DialogContent, Stack } from '@mui/material';
import EmailTextField from '../AuthTextFields';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';

interface ForgotPasswordDialogProps {
  dialogIsOpen: boolean;
  closeDialog: () => void;
}

const ForgetPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Email must be a valid email address').required('Email is required'),
});

export default function AuthDialog(props: ForgotPasswordDialogProps) {
  const { dialogIsOpen, closeDialog } = props

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: ForgetPasswordSchema,
    onSubmit: async (data) => {

      console.log('send emial for code to :', data)

      axios.post(
        '/api/auth/send-code/',
        { email: data.email },
      )
        .then((res) => {
          
          formik.setSubmitting(false)
          console.log(res)
        })
        .catch((error) => {
          formik.setSubmitting(false)
          console.log(error)
        })
    },
  })

  const { errors, touched, handleSubmit, getFieldProps, isSubmitting, isValid } = formik

  

  return (
    <DraggableDialog
      dialogIsOpen={dialogIsOpen}
      ariaLabel="forgot-dialog"
      title="FORGOT PASSWORD DIALOG"
    >
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={3} sx={{ width: '100%' }}>           
              <EmailTextField
                  getFieldProps={getFieldProps}
                  error={errors.email}
                  touched={touched.email}
                />
                <LoadingButton
                  color="success"
                  disabled={!(isValid && formik.dirty)}
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  Get Change Password Code
                </LoadingButton>
            </Stack>
          </DialogContent>          
        </Form>
      </FormikProvider>
    </DraggableDialog>
  )
}