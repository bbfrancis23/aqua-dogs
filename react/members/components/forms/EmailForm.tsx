import {useState} from "react"
import {Box, TextField, TextFieldProps, Typography} from "@mui/material"
import {useSnackbar} from "notistack"
import axios from "axios"
import {Form, FormikProvider, useFormik} from "formik"
import { EmailSchema } from "@/react/auth"
import { ClickAwaySave, FormActions } from "@/fx/ui"

export type EmailFormProps = {
  email: string,
  onUpdateMember: () => void
}

export default function EmailForm(params: EmailFormProps){

  const {onUpdateMember} = params
  const [email, setEmail] = useState(params.email)

  const {enqueueSnackbar} = useSnackbar()
  const [emailForm, setEmailForm] = useState<boolean>(false)

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
            formik.resetForm()
            enqueueSnackbar("Email Updated. Revalidate required", {variant: "success"})
            setEmail(data.email)
            setEmailForm(false)
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
  }

  return (
    <Box >
      {(email && !emailForm) && (
        <Box onClick={() => setEmailForm(!emailForm)} sx={{cursor: "pointer"}}>
          <>
            <Typography sx={{display: "inline", mr: 1, cursor: "pointer", fontWeight: 'bold'}}>
              Email:
            </Typography>
            {email}
          </>
        </ Box>
      )}
      { emailForm && (
        <FormikProvider value={formik}>
          <ClickAwaySave>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', mt: 3}}><TextField {...textFieldProps} /></Box>
              <Box display={{ display: 'flex', justifyContent: "right" }}>
                <FormActions onCancel={() => setEmailForm(false)} title={'Email'} />
              </Box>
            </Form>
          </ClickAwaySave>
        </FormikProvider>
      )}
    </Box>
  )
}

// QA Brian Francis 11-07-23