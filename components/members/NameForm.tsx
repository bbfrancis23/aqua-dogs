import {useState} from "react"

import {Box, Button, TextField, Typography} from "@mui/material"
import {LoadingButton} from "@mui/lab"
import SaveIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

import {useSnackbar} from "notistack"

import axios from "axios"
import {FormikProvider, useFormik, Form} from "formik"
import * as Yup from "yup"

const NameSchema = Yup.object().shape({
  memberName: Yup.string()
    .required("Member Name is required"),
})

export default function NameForm(params: {name: string}){

  const [name, setName] = useState(params.name)

  const {enqueueSnackbar} = useSnackbar()
  const [formError, setFormError] = useState<string>("")
  const [displayTextField, setDisplayTextField] = useState<boolean>(false)


  const formik = useFormik({
    initialValues: { memberName: name ? name : "" },
    validationSchema: NameSchema,
    onSubmit: (data) => {
      axios.patch( "/api/auth/member", {memberName: data.memberName}, )
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === 200 ){
            enqueueSnackbar("Member Name Updated", {variant: "success"})
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

  const {errors, touched, handleSubmit, getFieldProps, isSubmitting, isValid} = formik

  return (
    <Box >
      {(name && !displayTextField) &&
        <Box onClick={() => setDisplayTextField(!displayTextField)} sx={{cursor: "pointer"}}>
          <Typography sx={{display: "inline", mr: 1, cursor: "pointer", fontWeight: 'bold'}}>
            Member Name:
          </Typography>
          {name}
        </ Box>
      }
      { displayTextField && (
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <TextField size="small" autoComplete="name" label={"Member Name"}
              {...getFieldProps("memberName")} error={Boolean(touched && errors.memberName)}
              helperText={touched && errors.memberName} sx={{mr: 1}} />
            <LoadingButton color="success" disabled={!(isValid && formik.dirty)}
              type="submit" loading={isSubmitting} sx={{minWidth: '0'}} >
              <SaveIcon fontSize={'large'} />
            </LoadingButton>
            {!name && (
              <Button onClick={() => setDisplayTextField(!displayTextField)}>
                {displayTextField ? "Cancel" : "Add Member Name"}
              </Button>
            )}

            {(name && displayTextField) && (
              <Button onClick={() => setDisplayTextField(!displayTextField)} sx={{minWidth: 0}} >
                <CloseIcon fontSize={'large'} color={'error'}/>
              </Button>
            )}
          </Form>
        </FormikProvider>
      )}
    </Box>
  )
}