import { ItemContext } from "@/interfaces/ItemInterface"
import { ProjectContext } from "@/interfaces/ProjectInterface"
import { useSnackbar } from "notistack"
import { useContext, useState } from "react"


import CheckIcon from '@mui/icons-material/Check'
import CancelIcon from '@mui/icons-material/Cancel'
import DeleteIcon from '@mui/icons-material/Delete'

import dynamic from "next/dynamic"


import { Comment } from "@/interfaces/CommentInterface";

import axios from "axios"
import { Form, FormikProvider, useFormik } from "formik"
import * as Yup from "yup"
import { Box, IconButton, Stack } from "@mui/material"
import Permission, { NoPermission, PermissionCodes } from "@/ui/PermissionComponent"
import { ProjectMemberAvatar } from "@/components/members/projects/ProjectMemberAvatar"

export interface CodeCommentProps {
  comment: Comment
}

const editCommentSchema = Yup.object().shape({
  comment: Yup.string().required('Comment Content is required'),
})

const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  {ssr: false}
)


export const CodeComment = (props: CodeCommentProps) => {
  const {comment} = props

  const {project} = useContext(ProjectContext)
  const {item, setItem} = useContext(ItemContext)

  const {enqueueSnackbar} = useSnackbar()

  const [displayEditCodeCommentForm, setDisplayEditCodeCommentForm] = useState<boolean>(false)

  const handleDeleteComment = () => {

    axios.delete(`/api/members/projects/${project?.id}/items/${item?.id}/comments/${comment.id}`)
      .then((res) => {
        setItem(res.data.item)
        enqueueSnackbar("Item Section Deleted", {variant: "success"})
      })
      .catch((e) => { enqueueSnackbar(e.response.data.message, {variant: "error"}) })
  }


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
            setDisplayEditCodeCommentForm(false);
          }
        })
        .catch((e) => {
          formik.setSubmitting(false)
          enqueueSnackbar(e.response.data.message, {variant: "error"})
        })
    }
  })

  const {errors, touched, handleSubmit, getFieldProps, isSubmitting, isValid} = formik

  return (
    <>
      { displayEditCodeCommentForm && (
        <>
          <Stack spacing={3} direction={'row'} sx={{ width: '100%'}}>
            <Box>
              <ProjectMemberAvatar type={PermissionCodes.PROJECT_MEMBER} member={comment.owner} />
            </Box>
            <Box sx={{ width: '100%', pt: 1, }}>
              <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                  <CodeEditor language="jsx" placeholder="Create Code Section"
                    {...getFieldProps('comment')} padding={15}
                    style={{ width: '100%', fontSize: 12, backgroundColor: "#f5f5f5",
                      fontFamily:
                  "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace" }}
                  />
                  <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                    <IconButton color="success" type="submit" disabled={!(isValid && formik.dirty)}>
                      <CheckIcon />
                    </IconButton>
                    <IconButton onClick={() => setDisplayEditCodeCommentForm(false)}>
                      <CancelIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteComment()}>
                      <DeleteIcon color={'error'}/>
                    </IconButton>
                  </Box>
                </Form>
              </FormikProvider>
            </Box>
          </Stack>
        </>
      ) }
      { !displayEditCodeCommentForm && (
        <>
          <Permission code={PermissionCodes.COMMENT_OWNER} comment={comment} member={comment.owner}>
            <Stack spacing={3} direction={'row'} sx={{ width: '100%'}}>
              <Box>
                <ProjectMemberAvatar type={PermissionCodes.PROJECT_MEMBER} member={comment.owner} />
              </Box>
              <CodeEditor onClick={() => setDisplayEditCodeCommentForm(true)}
                key={comment.id} value={comment.content} language="jsx" readOnly padding={15}
                style={{ width: '100%', fontSize: 12, backgroundColor: "#f5f5f5",
                  fontFamily: "ui-monospace,SF Mono,Consolas,Liberation Mono,Menlo,monospace" }} />
            </Stack>
          </Permission>
          <NoPermission
            code={PermissionCodes.COMMENT_OWNER} comment={comment} member={comment.owner}>
            <Stack spacing={3} direction={'row'} sx={{ width: '100%'}}>
              <Box>
                <ProjectMemberAvatar type={PermissionCodes.PROJECT_MEMBER} member={comment.owner} />
              </Box>
              <CodeEditor key={comment.id}
                value={comment.content} language="jsx" readOnly padding={15}
                style={{ width: '100%', fontSize: 12, backgroundColor: "#f5f5f5",
                  fontFamily:"ui-monospace,SF Mono,Consolas,Liberation Mono,Menlo,monospace" }} />
            </Stack>
          </NoPermission>
        </>
      ) }
    </>
  )
}