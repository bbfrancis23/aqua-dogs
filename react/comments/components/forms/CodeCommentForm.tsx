import { useContext } from "react"
import { Avatar, Box, IconButton, Stack, } from "@mui/material"
import { SxProps } from "@mui/material/styles"
import { useSnackbar } from "notistack"
import { LoadingButton } from "@mui/lab"
import CheckIcon from '@mui/icons-material/Check'
import DeleteIcon from '@mui/icons-material/Delete'
import CancelIcon from '@mui/icons-material/Cancel'
import axios from "axios"
import { Form, FormikProvider, useFormik } from "formik"
import * as Yup from "yup"
import { Comment } from "@/react/comments"
import { ProjectContext } from "@/react/project"
import { ItemContext } from "@/react/item"
import { FxCodeEditor, SaveButton } from "@/fx/ui"

const errorMsg = "Comment Content is required"
const editCommentSchema = Yup.object().shape({ comment: Yup.string().required(errorMsg)})

export interface CommentForm {
  comment: Comment,
  closeForm: () => void,
}

export const CodeCommentForm = ({comment, closeForm}: CommentForm) => {

  const {project} = useContext(ProjectContext)
  const {item, setItem} = useContext(ItemContext)
  const {enqueueSnackbar} = useSnackbar()

  const formik = useFormik({
    initialValues: { comment: comment.content },
    validationSchema: editCommentSchema,
    onSubmit: (data) => {
      axios.patch(`/api/members/projects/${project?.id}/items/${item?.id}/comments/${comment.id}`,
        {content: data.comment, sectiontype: "63b88d18379a4f30bab59bad"})
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Ok ){
            setItem(res.data.item)
            enqueueSnackbar("Item Section Updated", {variant: "success"})
            formik.resetForm()
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
        enqueueSnackbar("Item Section Deleted", {variant: "success"})
        formik.setSubmitting(false)
      })
      .catch((e) => {
        enqueueSnackbar(e.response.data.message, {variant: "error"})
        formik.setSubmitting(false)
      })
  }

  const { handleSubmit, getFieldProps, isSubmitting} = formik

  const actionsSx: SxProps = { minWidth: '0', pl: 1 }

  return (
    <Stack spacing={3} direction={'row'} sx={{ width: '100%'}}>
      <Avatar />
      <Box sx={{ width: '100%', pt: 1, }}>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <FxCodeEditor placeholder="Create Code Comment" {...getFieldProps('comment')} />
            <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
              <SaveButton sx={actionsSx} >
                <CheckIcon />
              </SaveButton>
              <IconButton onClick={() => closeForm()} sx={actionsSx}>
                <CancelIcon />
              </IconButton>
              <LoadingButton sx={actionsSx} loading={isSubmitting} onClick={() => deleteComment()}>
                { isSubmitting ? '' : <DeleteIcon color={'error'}/>}
              </LoadingButton>
            </Box>
          </Form>
        </FormikProvider>
      </Box>
    </Stack>
  )
}

export default CodeCommentForm

// QA Brian Francis 10-27-23