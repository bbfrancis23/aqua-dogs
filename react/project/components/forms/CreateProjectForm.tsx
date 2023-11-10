import { Box, TextField, TextFieldProps } from "@mui/material"
import { useSnackbar } from "notistack"
import { useSession } from "next-auth/react"
import { FormikProvider, useFormik, Form,} from "formik"
import * as Yup from "yup"
import axios from "axios"
import { Project } from "@/react/project"
import { ClickAwaySave, FormActions, SaveButton } from "@/fx/ui"

export interface CreateProjectFormProps{
  setProjects: ( p: Project[]) => void,
  closeForm: () => void
}

const createProjectSchema = Yup.object().shape({ title: Yup.string().required('Title is required')})

const CreateProjectForm = ({setProjects, closeForm}: CreateProjectFormProps) => {

  const {enqueueSnackbar} = useSnackbar()
  const {data: session} = useSession()

  const formik = useFormik({
    initialValues: { title: '' },
    validationSchema: createProjectSchema,
    onSubmit: (data) => {
      axios.post( "/api/members/projects", {title: data.title} ) .then((res) => {
        formik.setSubmitting(false)
        if (res.status === axios.HttpStatusCode.Created ){
          setProjects(res.data.projects)
          enqueueSnackbar("Project created", {variant: "success"})
          closeForm()
          formik.resetForm()
        }
      }) .catch((error) => {
        formik.setSubmitting(false)
        console.log(error)
        enqueueSnackbar(error.response.data.message, {variant: "error"})
      })
    }
  })

  const {errors, touched, handleSubmit, getFieldProps, isSubmitting, isValid} = formik

  const textFieldProps: TextFieldProps = {
    size: 'small',
    label: 'New Project',
    ...getFieldProps('title'),
    error: Boolean(touched && errors.title),
    helperText: touched && errors.title,
    autoFocus: true
  }

  return(
    <Box sx={{m: 3}}>
      { session && (
        <FormikProvider value={formik}>
          <ClickAwaySave>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', mt: 3}}><TextField {...textFieldProps}/></Box>
              <Box display={{ display: 'flex', justifyContent: "right" }}>
                <FormActions onCancel={closeForm} title={'Project'} />
              </Box>
            </Form>
          </ClickAwaySave>
        </FormikProvider>
      )}
    </Box>
  )
}

export default CreateProjectForm

// QA Brian Francis 11-07-23