import {useState} from "react"
import {Box, Button, TextField, TextFieldProps, Typography} from "@mui/material"
import {LoadingButton} from "@mui/lab"
import SaveIcon from '@mui/icons-material/Done'
import CloseIcon from '@mui/icons-material/Close'
import {useSnackbar} from "notistack"
import axios from "axios"
import {Form, FormikProvider, useFormik} from "formik"
import * as Yup from "yup"
import { EmailSchema } from "@/react/auth"
import { SaveButton } from "@/fx/ui"

export type EmailFormProps = {
  email: string,
  onUpdateMember: () => void
}

export default function EmailForm(params: EmailFormProps){

  const {onUpdateMember} = params
  const [email, setEmail] = useState(params.email)

  const {enqueueSnackbar} = useSnackbar()
  const [displayTextField, setDisplayTextField] = useState<boolean>(false)

  const formik = useFormik({
    initialValues: {
      email: email ? email : ""
    },
    validationSchema: EmailSchema,
    onSubmit: (data) => {
      axios.patch( "/api/auth/member", {email: data.email})
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === 200 ){
            onUpdateMember()
            enqueueSnackbar("Email Updated. Revalidate required", {variant: "success"})
            setEmail(data.email)
            setDisplayTextField(false)
          }
        })
        .catch((error) => {
          formik.setSubmitting(false)
          enqueueSnackbar(`Error updating email ${error}`, {variant: "error"})
        })
    }
  })

  const {errors, touched, handleSubmit, getFieldProps} = formik

  const textFieldProps: TextFieldProps = {
    size: "small",
    autoComplete: "email",
    label: "Email",
    ...getFieldProps("email"),
    error: Boolean(touched && errors.email),
    helperText: touched && errors.email,
    sx: {mr: 1}
  }

  return (
    <Box >
      {(email && !displayTextField) && (
        <Box onClick={() => setDisplayTextField(!displayTextField)} sx={{cursor: "pointer"}}>
          <>
            <Typography sx={{display: "inline", mr: 1, cursor: "pointer", fontWeight: 'bold'}}>
              Email:
            </Typography>
            {email}
          </>
        </ Box>
      )}
      { displayTextField && (
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', mt: 3}}><TextField {...textFieldProps} /></Box>
            <Box display={{ display: 'flex', justifyContent: "right" }}>
              <SaveButton sx={{minWidth: '0'}} ><SaveIcon /></SaveButton>
              {(email && displayTextField) && (
                <Button onClick={() => setDisplayTextField(!displayTextField)} sx={{minWidth: 0}}>
                  <CloseIcon color={'error'}/>
                </Button>
              )}
            </Box>
          </Form>
        </FormikProvider>
      )}
    </Box>
  )
}

// QA done 10-29-23