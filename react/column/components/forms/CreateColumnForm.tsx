import { useContext, useState } from "react"

import { alpha, Box, Button, IconButton, TextField, useTheme } from "@mui/material"
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from "notistack"

import { Form, FormikProvider, useFormik } from "formik"
import * as Yup from "yup"
import axios from "axios"

import { ProjectContext } from "@/react/project/"
import { BoardContext } from "@/react/board/BoardContext"

import ColumnStub from "../ColStub";
import { LoadingButton } from "@mui/lab";
import { FxThemeContext } from "@/fx/theme";

const createColSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
})

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
      axios.post(
        `/api/members/projects/${project.id}/boards/${board.id}/columns`,
        {title: data.title},
      )
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Created ){

            setBoard(res.data.board)

            enqueueSnackbar("Column created", {variant: "success"})
            formik.resetForm()
            setShowForm(false);
          }
        })
        .catch((error) => {

          formik.setSubmitting(false)
          enqueueSnackbar(error.message, {variant: "error"})
        })
    }
  })

  const handleCloseForm = () => {
    formik.resetForm();
    setShowForm(false);
  }

  const {errors, touched, handleSubmit, getFieldProps, isSubmitting, isValid} = formik

  const ColumnForm = (
    <Box sx={{ width: '272px', display: 'inline-block' }}>
      <Box sx={{ bgcolor: alpha(fxTheme.theme.palette.background.default, 0.4), p: 1,
        borderRadius: 3, width: 272, }}>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Box sx={{ ml: 1, display: 'flex'}}>
              <TextField size={'small'} label="New Item" {...getFieldProps('title')}
                error={Boolean(touched && errors.title)} helperText={touched && errors.title}
                sx={{width: 140}}
              />
              <Box>
                {/* <IconButton color="success" disabled={!(isValid && formik.dirty)}
                  type="submit"
                  sx={{ml: 1, }} >
                  <DoneIcon />
                </IconButton> */}
                <LoadingButton color="success" disabled={!(isValid && formik.dirty)}
                  type="submit" loading={isSubmitting} sx={{minWidth: '0', pl: 2}} >
                  <DoneIcon />
                </LoadingButton>
                <IconButton onClick={() => handleCloseForm()}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </ Box>
          </Form>
        </FormikProvider>
      </Box>
    </Box>
  )

  return(
    showForm ? ColumnForm
      :
      <Box>
        <Button onClick={() => setShowForm(true)} sx={{ m: 0, p: 0}}>
          <ColumnStub />
        </Button>
      </Box>
  )

}
export default CreateColumnForm

// QA: Brian Francisc 8-17-23
// ENHANCEMENTS: Replace numbers with theme vars