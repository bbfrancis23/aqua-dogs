import { useContext } from "react"
import { Box, Stack, TextField, TextFieldProps } from "@mui/material"
import { useSnackbar } from "notistack"
import { Form, FormikProvider, useFormik } from "formik"
import axios from "axios"
import { ProjectContext } from "@/react/project"
import { ItemContext } from "@/react/item"
import { Comment } from "@/react/comments"
import { ProjectMemberAvatar } from "@/react/members"
import { ClickAwaySave, FormActions, PermissionCodes, SaveButton } from "@/fx/ui"
import { SectionTypes, commentSchema } from "@/react/section"

export interface TextCommentFormProps { comment: Comment, closeForm: () => void}

const TextCommentForm = ({comment, closeForm}: TextCommentFormProps) => {

  const {project} = useContext(ProjectContext)
  const {item, setItem} = useContext(ItemContext)
  const {enqueueSnackbar} = useSnackbar()

  const formik = useFormik({
    initialValues: { comment: comment.content },
    validationSchema: commentSchema,
    onSubmit: (data) => {
      const commentPath = `/api/members/projects/${project?.id}/items/${item?.id}/comments/`
      const sectiontype = SectionTypes.TEXT
      axios.patch(`${commentPath}${comment.id}`, {content: data.comment, sectiontype})
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Ok ){
            formik.resetForm({values: {comment: data.comment}})
            setItem(res.data.item)
            enqueueSnackbar("Comment Updated", {variant: "success"})
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

  const {errors, touched, handleSubmit, getFieldProps} = formik

  const textFieldProps: TextFieldProps = {
    multiline: true,
    rows: 4,
    sx: { width: '100%'},
    label: "Update Comment",
    ...getFieldProps('comment'),
    error: Boolean(touched && errors.comment),
    helperText: touched && errors.comment
  }

  return (
    <>
      <Stack spacing={3} direction={'row'} sx={{ width: '100%'}}>
        <Box>
          <ProjectMemberAvatar type={PermissionCodes.PROJECT_MEMBER} member={comment.owner} />
        </Box>
        <Box sx={{ width: '100%', pt: 1, }}>
          <FormikProvider value={formik}>
            <ClickAwaySave>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <TextField {...textFieldProps} />
                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                  <FormActions title={'Comment'} onDelete={deleteComment} onCancel={closeForm} />
                </Box>
              </Form>
            </ClickAwaySave>
          </FormikProvider>
        </Box>
      </Stack>
    </>
  )
}

export default TextCommentForm

// QA Brian Francis 11-06-23