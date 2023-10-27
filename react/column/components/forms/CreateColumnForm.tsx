import { useContext, useState } from "react"
import { Box, BoxProps, Button, IconButton, TextField, TextFieldProps } from "@mui/material"
import { alpha } from '@mui/material/styles'
import DoneIcon from '@mui/icons-material/Done'
import CloseIcon from '@mui/icons-material/Close'
import { useSnackbar } from "notistack"
import { Form, FormikProvider, useFormik } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { ProjectContext } from "@/react/project"
import { BoardContext } from "@/react/board"
import {ColumnStub} from "@/react/column"
import { FxThemeContext } from "@/fx/theme"
import { SaveButton } from "@/fx/ui"

const createColSchema = Yup.object().shape({ title: Yup.string().required('Title is required')})

export const CreateColumnForm = () => {

  const {project} = useContext(ProjectContext)
  const {fxTheme} = useContext(FxThemeContext)
  const {board, setBoard} = useContext(BoardContext)
  const {enqueueSnackbar} = useSnackbar()
  const [showForm, setShowForm] = useState<boolean>(false)

  const formik = useFormik({
    initialValues: { title: '' },
    validationSchema: createColSchema,
    onSubmit: (data) => {
      const createColPath = `/api/members/projects/${project.id}/boards/${board.id}/columns`
      axios.post(createColPath, {title: data.title}, )
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Created ){
            setBoard(res.data.board)
            enqueueSnackbar("Column created", {variant: "success"})
            formik.resetForm()
            setShowForm(false)
          }
        })
        .catch((error) => {
          formik.setSubmitting(false)
          enqueueSnackbar(error.message, {variant: "error"})
        })
    }
  })

  const closeForm = () => { formik.resetForm(); setShowForm(false) }

  const {errors, touched, handleSubmit, getFieldProps, isSubmitting, isValid, dirty} = formik

  const colTitleTextField: TextFieldProps = {
    size: 'small',
    label: 'New Item',
    ...getFieldProps('title'),
    error: Boolean(touched && errors.title),
    helperText: touched && errors.title,
    sx: {width: 140}
  }

  const colBox: BoxProps = {
    sx: {
      bgcolor: alpha(fxTheme.theme.palette.background.default, 0.4),
      p: 1, borderRadius: 3, width: 272
    }
  }

  const ColumnForm = (
    <Box sx={{ width: '272px', display: 'inline-block' }}>
      <Box {...colBox}>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Box sx={{ ml: 1, display: 'flex'}}>
              <TextField {...colTitleTextField}/>
              <Box>
                <SaveButton sx={{minWidth: '0', pl: 2}} ><DoneIcon /></SaveButton>
                <IconButton onClick={() => closeForm()}><CloseIcon /></IconButton>
              </Box>
            </ Box>
          </Form>
        </FormikProvider>
      </Box>
    </Box>
  )

  return( showForm ? ColumnForm :
    <Box><Button onClick={() => setShowForm(true)} sx={{ m: 0, p: 0}}><ColumnStub /></Button></Box>
  )

}
export default CreateColumnForm

// QA: Brian Francisc 10-26-23