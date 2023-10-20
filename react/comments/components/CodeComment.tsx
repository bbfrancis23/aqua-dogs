/* eslint-disable max-lines-per-function */

import { ProjectContext } from "@/react/project"
import { useSnackbar } from "notistack"
import { useContext, useState } from "react"


import CheckIcon from '@mui/icons-material/Check'
import CancelIcon from '@mui/icons-material/Cancel'
import DeleteIcon from '@mui/icons-material/Delete'

import dynamic from "next/dynamic"

import { Comment } from "@/react/comments/comment-types";

import axios from "axios"
import { Form, FormikProvider, useFormik } from "formik"
import * as Yup from "yup"
import { Box, IconButton, Stack } from "@mui/material"
import Permission, { NoPermission, PermissionCodes } from "fx/ui/PermissionComponent"
import { LoadingButton } from "@mui/lab"
import { ItemContext } from "@/react/item/ItemContext"
import { ProjectMemberAvatar } from "@/react/members/components/ProjectMemberAvatar"

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

/*eslint-disable max-lines*/
export const CodeComment = (props: CodeCommentProps) => {
  const {comment} = props

  const {project} = useContext(ProjectContext)
  const {item, setItem} = useContext(ItemContext)

  const {enqueueSnackbar} = useSnackbar()

  const [displayEditCodeCommentForm, setDisplayEditCodeCommentForm] = useState<boolean>(false)

  const Avatar = () => (
    <Box><ProjectMemberAvatar type={PermissionCodes.PROJECT_MEMBER} member={comment.owner} /></Box>
  )

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

  const handleDeleteComment = () => {
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

  const {errors, touched, handleSubmit, getFieldProps, isSubmitting, isValid} = formik

  return (
    <>
      { displayEditCodeCommentForm && (
        <Stack spacing={3} direction={'row'} sx={{ width: '100%'}}>
          <Avatar />
          <Box sx={{ width: '100%', pt: 1, }}>
            <FormikProvider value={formik}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <CodeEditor language="jsx" placeholder="Create Code Section" padding={15}
                  {...getFieldProps('comment')}
                  style={{ width: '100%', fontSize: 12, backgroundColor: "#f5f5f5",
                    fontFamily:
                    "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace"
                  }} />
                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                  <LoadingButton color="success" disabled={!(isValid && formik.dirty)} type="submit"
                    loading={isSubmitting} sx={{minWidth: '0', pl: 1}} >
                    <CheckIcon />
                  </LoadingButton>
                  <IconButton onClick={() => setDisplayEditCodeCommentForm(false)}
                    sx={{minWidth: '0', pl: 1}}>
                    <CancelIcon />
                  </IconButton>
                  <LoadingButton sx={{minWidth: '0', pl: 1}} loading={isSubmitting}
                    onClick={() => handleDeleteComment()}>
                    { isSubmitting ? '' : <DeleteIcon color={'error'}/>}
                  </LoadingButton>
                </Box>
              </Form>
            </FormikProvider>
          </Box>
        </Stack>
      ) }
      { !displayEditCodeCommentForm && (
        <>
          <Permission code={PermissionCodes.COMMENT_OWNER} comment={comment} member={comment.owner}>
            <Stack spacing={3} direction={'row'} sx={{ width: '100%'}}>
              <Avatar />
              <CodeEditor onClick={() => setDisplayEditCodeCommentForm(true)}
                key={comment.id} value={comment.content} language="jsx" readOnly padding={15}
                style={{ width: '100%', fontSize: 12, backgroundColor: "#f5f5f5",
                  fontFamily: "ui-monospace,SF Mono,Consolas,Liberation Mono,Menlo,monospace" }} />
            </Stack>
          </Permission>
          <NoPermission code={PermissionCodes.COMMENT_OWNER} comment={comment}
            member={comment.owner}>
            <Stack spacing={3} direction={'row'} sx={{ width: '100%'}}>
              <Avatar />
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