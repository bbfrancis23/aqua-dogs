import { useContext } from "react"
import { useSession } from "next-auth/react"
import { Box, TextField, TextFieldProps} from "@mui/material"
import { useSnackbar } from "notistack"
import { FormikProvider, useFormik, Form } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { Board } from "@/react/board"
import { ProjectContext } from "@/react/project"
import { ClickAwaySave, FormActions, SaveButton } from "@/fx/ui"
export interface CreateBoardFormProps{
  setBoards: (b: Board[]) => void,
  closeForm: () => void
}

const createBoardSchema = Yup.object().shape({ title: Yup.string().required('Title is required')})

const CreateBoardForm = ({setBoards, closeForm}: CreateBoardFormProps) => {

  const {project} = useContext(ProjectContext)
  const {enqueueSnackbar} = useSnackbar()
  const {data: session, status} = useSession()

  const formik = useFormik({
    initialValues: { title: '' },
    validationSchema: createBoardSchema,
    onSubmit: (data) => {
      axios.post( `/api/members/projects/${project.id}/boards`, {title: data.title} )
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Created ){
            setBoards(res.data.boards)
            enqueueSnackbar("Board created", {variant: "success"})
            closeForm()
            formik.resetForm()
          }
        })
        .catch((error) => {
          formik.setSubmitting(false)
          enqueueSnackbar(error.message, {variant: "error"})
        })
    }
  })

  const {errors, touched, handleSubmit, getFieldProps} = formik

  const boardTextFieldProps: TextFieldProps = {
    fullWidth: true,
    size: 'small',
    label: 'New Board',
    ...getFieldProps('title'),
    error: Boolean(touched && errors.title),
    helperText: touched && errors.title
  }

  return(
    <Box >
      { session && (
        <FormikProvider value={formik}>
          <ClickAwaySave>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', mt: 3}}><TextField {...boardTextFieldProps} /></Box>
              <Box display={{ display: 'flex', justifyContent: "right" }}>
                <FormActions onCancel={closeForm} title="Board" />
              </Box>
            </Form>
          </ClickAwaySave>
        </FormikProvider>
      )}
    </Box>
  )
}

export default CreateBoardForm
// QA: Brian Francis 11-07-23
