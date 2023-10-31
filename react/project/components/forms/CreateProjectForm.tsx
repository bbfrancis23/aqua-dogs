import { Box, Button, TextField, TextFieldProps } from "@mui/material"
import { useSnackbar } from "notistack"
import { useSession } from "next-auth/react"
import { FormikProvider, useFormik, Form,} from "formik"
import SaveIcon from '@mui/icons-material/Done'
import CloseIcon from '@mui/icons-material/Close'
import * as Yup from "yup"
import axios from "axios"
import { LoadingButton } from "@mui/lab"
import { Project } from "@/react/project"
import { SaveButton } from "@/fx/ui"

export interface CreateProjectFormProps{
  setProjects: ( p: Project[]) => void;
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
        enqueueSnackbar(error.message, {variant: "error"})
      })
    }
  })

  const {errors, touched, handleSubmit, getFieldProps, isSubmitting, isValid} = formik

  const textFieldProps: TextFieldProps = {
    size: 'small',
    label: 'New Project',
    ...getFieldProps('title'),
    error: Boolean(touched && errors.title),
    helperText: touched && errors.title
  }

  return(
    <Box sx={{m: 3}}>
      { session && (
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', mt: 3}}><TextField {...textFieldProps}/></Box>
            <Box display={{ display: 'flex', justifyContent: "right" }}>
              <SaveButton sx={{minWidth: '0' }} ><SaveIcon /></SaveButton>
              <Button onClick={() => closeForm()} sx={{minWidth: 0}}>
                <CloseIcon color={'error'}/>
              </Button>
            </Box>
          </Form>
        </FormikProvider>
      )}
    </Box>
  )
}

export default CreateProjectForm

// QA done 10-30-23