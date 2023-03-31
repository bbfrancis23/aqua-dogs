import { LoadingButton } from '@mui/lab';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { Form, FormikProvider, useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import * as Yup from 'yup';

const EmailSchema = Yup.object().shape({
  email: Yup.string().email('Email must be a valid email address').required('Email is required'),
});

export default function EmailForm(params: {email: string}){
  const [email, setEmail] = useState(params.email)

  const { enqueueSnackbar } = useSnackbar();
  const [formError, setFormError] = useState<string>('');
  const [displayTextField, setDisplayTextField] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
     email: email ? email : ''
    },
    validationSchema: EmailSchema,
    onSubmit: async (data) => {
      axios.patch(
        '/api/auth/member',
        { email: data.email },
      )
      .then((res) => {
        formik.setSubmitting(false)
        if (res.status === 200 ){
          enqueueSnackbar('Email Updated', {variant: 'success'});
          setEmail(data.email)
          setDisplayTextField(false)
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
    <Box >          
      {(email && !displayTextField) && (
        <Box  onClick={() => setDisplayTextField(!displayTextField)} sx={{ cursor: 'pointer' }}>
          <>
            <Typography  sx={{ display: 'inline', mr: 1, cursor: 'pointer' }}>Emain:</Typography> {email}
          </>
        </ Box> 
      )}     
      { displayTextField &&  (
        <FormikProvider value={formik}>    
          <Form autoComplete='off' noValidate onSubmit={handleSubmit}>

           <TextField
              size='small'
              autoComplete='email'
              label={'Email'} 
              {...getFieldProps('email')}
              error={Boolean(touched && errors.email)}
              helperText={touched && errors.email}
              sx={{ mr: 1}}
            />      
            <LoadingButton
              color='success'
              disabled={!(isValid && formik.dirty)}
              type='submit'
              variant='contained'
              loading={isSubmitting}
              sx={{ mr: 1}}
            >
              Save
            </LoadingButton>  
           

            {(email && displayTextField)&&  (
              <Button  onClick={() => setDisplayTextField(!displayTextField)}>
              Cancel
              </Button>
            )}
          </Form>
        </FormikProvider>      
      )}

     
            
    </Box>
  )
}