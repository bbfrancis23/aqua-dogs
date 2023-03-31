import { useState } from "react";
import { useSession} from "next-auth/react";

import { Alert, Box, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import axios from "axios";

import { FormikProvider, useFormik, Form } from "formik";
import { PasswordTextField} from '../AuthTextFields'

import { useSnackbar } from 'notistack';
import * as Yup from 'yup';

import { passwordSchema } from "../AuthFormSchema";


const ChangePasswordFormSchema = Yup.object().shape({
  oldPassword: passwordSchema,
  newPassword: passwordSchema
});

export default function ChangePasswordForm(){
  const { enqueueSnackbar } = useSnackbar();

  const [formError, setFormError] = useState<string>('')

  const { data: session, status } = useSession()

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: ''
    },
    validationSchema: ChangePasswordFormSchema,
    onSubmit: async (data) => {
      axios.patch(
        '/api/auth/change-password',
        { oldPassword: data.oldPassword, newPassword: data.newPassword },
      )
      .then((res) => {        
        formik.setSubmitting(false)
        if (res.status === axios.HttpStatusCode.Ok ){
          enqueueSnackbar('Password changed', {variant: 'success'});
        } 
      })
      .catch((error) => {
        formik.setSubmitting(false)
        setFormError(error.response.data.message)
      }) 
    }
  })

  const { errors, touched, handleSubmit, getFieldProps, isSubmitting, isValid } = formik

  return (
    <Box sx={{ m: 3}}>
      { session && (
        <>
          <Typography sx={{display: 'block'}}>Change Password:</Typography>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Stack spacing={3} sx={{ width: '300px'}}>
                { formError && (<Alert severity="error">{formError}</Alert>) }
                <PasswordTextField
                  label="Old Password"
                  fieldId="oldPassword"
                  getFieldProps={getFieldProps}
                  error={errors.oldPassword}
                  touched={touched.oldPassword}
                />      
                  <PasswordTextField
                  label="New Password"
                  fieldId="newPassword"
                  getFieldProps={getFieldProps}
                  error={errors.newPassword}
                  touched={touched.newPassword}
                />   
                <LoadingButton
                  color="success"
                  disabled={!(isValid && formik.dirty)}
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  Change Password
                </LoadingButton>        
              </Stack>
            </Form>
          </FormikProvider>
        </>
      )}
    </Box>
  )
}

