import { useContext } from "react"
import { Box, IconButton, Stack, TextField, TextFieldProps } from "@mui/material"
import LoadingButton, { LoadingButtonProps } from "@mui/lab/LoadingButton"
import CheckIcon from '@mui/icons-material/Check'
import CancelIcon from '@mui/icons-material/Cancel'
import DeleteIcon from '@mui/icons-material/Delete'
import { useSnackbar } from "notistack"
import { Form, FormikProvider, useFormik } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { ProjectContext } from "@/react/project"
import { ItemContext } from "@/react/item"
import { Comment } from "@/react/comments"
import { ProjectMemberAvatar } from "@/react/members"
import { PermissionCodes, SaveButton } from "@/fx/ui"

export interface TextCommentFormProps {
  comment: Comment,
  closeForm: () => void,
}

const errorMsg = "Comment Content is required"
const editCommentSchema = Yup.object().shape({ comment: Yup.string().required(errorMsg)})

const TextCommentForm = ({comment, closeForm}: TextCommentFormProps) => {

  const {project} = useContext(ProjectContext)
  const {item, setItem} = useContext(ItemContext)
  const {enqueueSnackbar} = useSnackbar()

  const formik = useFormik({
    initialValues: { comment: comment.content },
    validationSchema: editCommentSchema,
    onSubmit: (data) => {
      const commentPath = `/api/members/projects/${project?.id}/items/${item?.id}/comments/`
      const sectiontype = "63b2503c49220f42d9fc17d9"
      axios.patch(`${commentPath}${comment.id}`, {content: data.comment, sectiontype})
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Ok ){
            formik.resetForm({values: {comment: data.comment}})
            setItem(res.data.item)
            enqueueSnackbar("Item Comment Updated", {variant: "success"})
            closeForm()
          }
        })
        .catch((e) => {
          formik.setSubmitting(false)
          enqueueSnackbar(e.response.data.message, {variant: "error"})
        })
    }
  })

  const deleteComment = () => {
    formik.setSubmitting(true)

    axios.delete(`/api/members/projects/${project?.id}/items/${item?.id}/comments/${comment.id}`)
      .then((res) => {
        setItem(res.data.item)
        enqueueSnackbar("Comment Deleted", {variant: "success"})
        formik.setSubmitting(false)
      })
      .catch((e) => {
        enqueueSnackbar(e.response.data.message, {variant: "error"})
        formik.setSubmitting(false)
      })
  }

  const {errors, touched, handleSubmit, getFieldProps, isSubmitting, isValid} = formik

  const textFieldProps: TextFieldProps = {
    multiline: true,
    rows: 4,
    sx: { width: '100%'},
    label: "Update Comment",
    ...getFieldProps('comment'),
    error: Boolean(touched && errors.comment),
    helperText: touched && errors.comment
  }

  const formActionsSx = {minWidth: '0', pl: 1}

  const deleteButtonProps: LoadingButtonProps = {
    loading: isSubmitting,
    onClick: () => deleteComment(),
    sx: formActionsSx,
  }

  return (
    <>
      <Stack spacing={3} direction={'row'} sx={{ width: '100%'}}>
        <Box>
          <ProjectMemberAvatar type={PermissionCodes.PROJECT_MEMBER} member={comment.owner} />
        </Box>
        <Box sx={{ width: '100%', pt: 1, }}>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <TextField {...textFieldProps} />
              <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                <SaveButton sx={{minWidth: '0', pl: 1}} >
                  <CheckIcon />
                </SaveButton>
                <IconButton onClick={() => closeForm()} sx={{minWidth: '0', pl: 1}}>
                  <CancelIcon />
                </IconButton>
                <LoadingButton {...deleteButtonProps}>
                  { isSubmitting ? '' : <DeleteIcon color={'error'}/>}
                </LoadingButton>
              </Box>
            </Form>
          </FormikProvider>
        </Box>
      </Stack>
    </>
  )
}

export default TextCommentForm

// QA Brian Francis 10-27-23