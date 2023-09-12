import {Column} from '@/interfaces/ColumnInterface'
import { Box, IconButton, TextField, Typography, alpha, useTheme } from "@mui/material"

import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

import { Form, FormikProvider, useFormik } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { useContext, useState } from 'react'
import { ProjectContext } from '@/interfaces/ProjectInterface'
import { BoardContext } from '@/interfaces/BoardInterface'
import { useSnackbar } from 'notistack'
import { FxTheme } from 'theme/globalTheme'
import Permission, { PermissionCodes, NoPermission } from '@/ui/PermissionComponent';
import { MemberContext } from '@/interfaces/MemberInterface';
import { LoadingButton } from '@mui/lab';

interface ColumnFormProps {
  column: Column
}

const colTitleSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
})

export const ColumnForm = (props: ColumnFormProps) => {

  const {column} = props

  const [showForm, setShowForm] = useState<boolean>(false)
  const {member} = useContext(MemberContext)


  const theme: FxTheme = useTheme()
  const {project} = useContext(ProjectContext)
  const {enqueueSnackbar} = useSnackbar()

  const {board, setBoard} = useContext(BoardContext)


  const formik = useFormik({
    initialValues: { title: column.title },
    validationSchema: colTitleSchema,
    onSubmit: (data) => {
      axios.patch(
        `/api/members/projects/${project.id}/boards/${board.id}/columns/${column.id}`,
        {title: data.title},
      )
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Ok ){

            setBoard(res.data.board)

            enqueueSnackbar("Column updated", {variant: "success"})
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
      <Box sx={{ bgcolor: alpha(theme.palette.background.default, 0.4), p: 1,
        borderRadius: 3, width: 272, }}>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Box sx={{ ml: 1, display: 'flex'}}>
              <TextField size={'small'} label="New Column" {...getFieldProps('title')}
                error={Boolean(touched && errors.title)} helperText={touched && errors.title}
                sx={{width: 140}}
              />
              <Box>

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


  return (

    showForm ? ColumnForm
      :
      <>
        <Permission code={PermissionCodes.PROJECT_ADMIN} project={project} member={member}>
          <Typography sx={{p: 2}} onClick={() => setShowForm(true)} >
            {column.title}
          </Typography>
        </Permission>
        <NoPermission code={PermissionCodes.PROJECT_ADMIN} project={project} member={member}>
          <Typography sx={{p: 2}} >
            {column.title}
          </Typography>
        </NoPermission>
      </>
  )
}

export default ColumnForm