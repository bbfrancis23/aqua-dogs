import { useContext } from "react"
import { Box, Stack, } from "@mui/material"
import { useSnackbar } from "notistack"
import axios from "axios"
import { Form, FormikProvider, useFormik } from "formik"
import { Comment } from "@/react/comments"
import { ProjectContext } from "@/react/project"
import { ItemContext } from "@/react/item"
import { ClickAwaySave, FormActions, FxCodeEditor, PermissionCodes } from "@/fx/ui"
import { ProjectMemberAvatar } from "@/react/members"
import { commentSchema } from "@/react/section"
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
    validationSchema: commentSchema,
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

  const { handleSubmit, getFieldProps} = formik

  return (
    <Stack spacing={3} direction={'row'} sx={{ width: '100%'}}>
      <Box>
        <ProjectMemberAvatar type={PermissionCodes.PROJECT_MEMBER} member={comment.owner} />
      </Box>
      <Box sx={{ width: '100%', pt: 1, }}>
        <FormikProvider value={formik}>
          <ClickAwaySave>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <FxCodeEditor placeholder="Create Code Comment" {...getFieldProps('comment')} />
              <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                <FormActions title={'Comment'} onDelete={deleteComment} onCancel={closeForm} />
              </Box>
            </Form>
          </ClickAwaySave>
        </FormikProvider>
      </Box>
    </Stack>
  )
}

export default CodeCommentForm

// QA Brian Francis 11-06-23