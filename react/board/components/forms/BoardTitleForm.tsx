import { useState, useContext } from "react"
import { useSession } from "next-auth/react"
import { Box, IconButton, Skeleton, TextField, TextFieldProps, Typography} from "@mui/material"
import { TypographyProps } from "@mui/material/Typography"
import { styled } from "@mui/material/styles"
import SaveIcon from '@mui/icons-material/Done'
import CloseIcon from '@mui/icons-material/Close'
import { useSnackbar } from "notistack"
import { Form, FormikProvider, useFormik } from "formik"
import axios from "axios"
import * as Yup from "yup"
import { ProjectContext } from "@/react/project"
import { BoardContext } from "@/react/board"
import { FormActions, SaveButton } from "@/fx/ui"

const TitleSchema = Yup.object().shape({ title: Yup.string() .required("Title is required")})

const BoardTitleTextField = styled(TextField)(() =>
  ({ '& .MuiOutlinedInput-root': { fontSize: '1.19rem' } }))

export const BoardTitleForm = () => {
  const {board} = useContext(BoardContext)
  const {project} = useContext(ProjectContext)
  const {data: session} = useSession()
  const {enqueueSnackbar} = useSnackbar()
  const [title, setTitle] = useState<string>(board.title)
  const [displayTextField, setDisplayTextField] = useState<boolean>(false)

  const formik = useFormik({
    initialValues: { title },
    validationSchema: TitleSchema,
    onSubmit: (data) => {
      axios.patch(`/api/members/projects/${project.id}/boards/${board.id}`, {title: data.title})
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Ok ){
            enqueueSnackbar("Board Title Updated", {variant: "success"})
            setTitle(data.title)
            setDisplayTextField(false)
            formik.resetForm({values: {title: data.title}})
          }else{ enqueueSnackbar(res.data.message, {variant: "error"}) }
        }).catch((error) => {
          formik.setSubmitting(false)
          enqueueSnackbar(`Error updating Board Title: ${error}`, {variant: "error"})
        })
    }
  })

  const {errors, touched, handleSubmit, getFieldProps} = formik

  const showTextField = () => {
    if(session && session.user){
      const user:any = session.user
      if(user.id === project.leader?.id) setDisplayTextField(true)
    }
  }

  const boardTitleProps: TypographyProps = {
    onClick: () => showTextField(),
    sx: {cursor: "pointer", display: 'contents', fontSize: '1.85rem'}
  }

  const boardTitleTextField: TextFieldProps = {
    size: 'small',
    label: 'Board',
    ...getFieldProps('title'),
    error: Boolean(touched && errors.title),
    helperText: touched && errors.title,
    autoFocus: true,
  }

  return (
    <Box >
      {(!displayTextField) &&
        <Typography {...boardTitleProps} noWrap
          sx={{fontSize: {xs: '1.25rem', md: '2rem'},
            width: {xs: '150px', md: 'auto'}, pt: {xs: 1, md: 0}}}>
          { title ? title : <Skeleton /> }</Typography> }
      { displayTextField && (
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'row'}}>
              <BoardTitleTextField {...boardTitleTextField} />

              <FormActions onCancel={() => setDisplayTextField(false)} title="Board"
                sx={{pt: '4px'}}/>
            </Box>
            {/* <SaveButton sx={{minWidth: '0'}}><SaveIcon /></SaveButton>
            {(title && displayTextField) && (
              <IconButton onClick={() => setDisplayTextField(false)}>
                <CloseIcon color={'error'}/>
              </IconButton>
            )} */}
          </Form>
        </FormikProvider>
      )}
    </Box>
  )
}

// QA: Brian Francisc 10-26-23