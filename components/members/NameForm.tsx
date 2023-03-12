import { Box, Button, Icon, IconButton, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useSnackbar } from "notistack";
import { useState } from "react";

import { FormikProvider, useFormik, Form } from "formik";
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';

import * as Yup from 'yup';
import { LoadingButton } from "@mui/lab";
import { isMemberName } from "typescript";

const NameSchema = Yup.object().shape({
  memberName: Yup.string()
    .min(
      2,
      `Name must be at least 2 characters`
    )
    .required('Member Name is required'),
});

export default function NameForm(params: any){

  //let {name} = params

  const [name, setName] = useState(params.name)

  const { enqueueSnackbar } = useSnackbar();
  const [formError, setFormError] = useState<string>('');
  const [displayTextField, setDisplayTextField] = useState<boolean>(false);

  const { data: session, status } = useSession()

  const formik = useFormik({
    initialValues: {
     memberName: ''
    },
    validationSchema: NameSchema,
    onSubmit: async (data) => {

      console.log('trying to submit')
      axios.patch(
        '/api/auth/member',
        { memberName: data.memberName },
      )
      .then((res) => {
        
        

        formik.setSubmitting(false)
        if (res.status === 200 ){
          enqueueSnackbar('Member Name Updated', {variant: 'success'});
          setName(data.memberName)
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
      {(name && !displayTextField)&& <Box  onClick={() => setDisplayTextField(!displayTextField)} sx={{ cursor: 'pointer' }}><Typography  sx={{ display: 'inline', mr: 1, cursor: 'pointer' }}>Member Name:</Typography> {name}</ Box> }     
      { displayTextField &&  (
        <FormikProvider value={formik}>    
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>

            <TextField
              size="small"
              autoComplete="name"
              label={'Member Name'} 
              {...getFieldProps('memberName')}
              error={Boolean(touched && errors.memberName)}
              helperText={touched && errors.memberName}
              sx={{ mr: 1}}
            />      
            <LoadingButton
              color="success"
              disabled={!(isValid && formik.dirty)}
              type="submit"
              variant="contained"
              loading={isSubmitting}
              sx={{ mr: 1}}
            >
              Save
            </LoadingButton>  
            {!name &&  (
              <Button  onClick={() => setDisplayTextField(!displayTextField)}>
                {displayTextField ? 'Cancel' : 'Add Member Name'}
              </Button>
            )}

            {(name && displayTextField)&&  (
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