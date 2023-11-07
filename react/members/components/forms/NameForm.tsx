import {useState} from "react"
import {Box, Button, TextField, TextFieldProps, Typography} from "@mui/material"
import {useSnackbar} from "notistack"
import axios from "axios"
import {FormikProvider, useFormik, Form} from "formik"
import * as Yup from "yup"
import { ClickAwaySave, FormActions, SaveButton } from "@/fx/ui"

const nameError = "Member Name is required"
const NameSchema = Yup.object().shape({ memberName: Yup.string() .required(nameError)})

export type NameFormProps = {
  name: string,
  onUpdateMember: () => void
}

export default function NameForm(params: NameFormProps){

  const {onUpdateMember} = params

  const [name, setName] = useState(params.name)
  const {enqueueSnackbar} = useSnackbar()
  const [nameForm, setNameForm] = useState<boolean>(false)

  const formik = useFormik({
    initialValues: { memberName: name ? name : "" },
    validationSchema: NameSchema,
    onSubmit: (data) => {
      axios.patch( "/api/auth/member", {memberName: data.memberName}, )
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === 200 ){
            onUpdateMember()
            formik.resetForm()
            enqueueSnackbar("Member Name Updated. Authentication Required", {variant: "success"})
            setName(data.memberName)
            setNameForm(false)
          }
        })
        .catch((error) => {
          formik.setSubmitting(false)
          enqueueSnackbar(`Error updating member name. ${error}`, {variant: "error"})
        })
    }
  })

  const {errors, touched, handleSubmit, getFieldProps} = formik

  const textFieldProps: TextFieldProps = {
    size: "small",
    autoComplete: "name",
    label: "Member Name",
    ...getFieldProps("memberName"),
    error: Boolean(touched && errors.memberName),
    helperText: touched && errors.memberName,
  }


  return (
    <Box >
      {(!nameForm) &&
        <Box onClick={() => setNameForm(!nameForm)} sx={{cursor: "pointer"}}>
          <Typography sx={{display: "inline", mr: 1, cursor: "pointer", fontWeight: 'bold'}}>
            Member Name:
          </Typography>
          {name ? name : <Button variant="outlined">Add Member Name</Button>}
        </ Box>
      }
      { nameForm && (
        <FormikProvider value={formik}>
          <ClickAwaySave>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit} style={{ marginTop: '5px'}}>
              <Box sx={{ display: 'flex', mt: 3}}><TextField {...textFieldProps}/></Box>
              <Box display={{ display: 'flex', justifyContent: "right" }}>
                <FormActions onCancel={() => setNameForm(false)} title={'Member Name'} />
              </Box>
            </Form>
          </ClickAwaySave>
        </FormikProvider>
      )}
    </Box>
  )
}

// QA done 11-07-23