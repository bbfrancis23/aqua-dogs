/* eslint-disable max-lines-per-function */
import { useContext, useState } from "react";
import { Box, IconButton, Stack, TextField, Typography } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';

import { Comment } from "@/react/comments/comment-types";
import { ProjectMemberAvatar } from "@/react/members/components/ProjectMemberAvatar";
import Permission, { NoPermission, PermissionCodes } from "fx/ui/PermissionComponent";
import { FormikProvider, useFormik, Form } from "formik";


import * as Yup from "yup"
import axios from "axios";
import { ProjectContext } from "@/react/project/";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { ItemContext } from "@/react/item/ItemContext";

export interface TextCommentProps {
  comment: Comment;
}

const editCommentSchema = Yup.object().shape({
  comment: Yup.string().required('Comment Content is required.'),
})

export const TextComment = (props: TextCommentProps) => {
  const {comment} = props;

  const {project} = useContext(ProjectContext)
  const {item, setItem} = useContext(ItemContext)

  const {enqueueSnackbar} = useSnackbar()

  const [displayEditTextCommentForm, setDisplayEditTextCommentForm] = useState<boolean>(false)


  const formik = useFormik({
    initialValues: { comment: comment.content },
    validationSchema: editCommentSchema,
    onSubmit: (data) => {
      axios.patch(`/api/members/projects/${project?.id}/items/${item?.id}/comments/${comment.id}`,
        {content: data.comment, sectiontype: "63b2503c49220f42d9fc17d9"})
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Ok ){
            formik.resetForm({values: {comment: data.comment}})
            setItem(res.data.item)
            enqueueSnackbar("Item Comment Updated", {variant: "success"})
            setDisplayEditTextCommentForm(false);
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
        enqueueSnackbar("Comment Deleted", {variant: "success"})
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
      {displayEditTextCommentForm && (
        <>
          <Stack spacing={3} direction={'row'} sx={{ width: '100%'}}>
            <Box>
              <ProjectMemberAvatar type={PermissionCodes.PROJECT_MEMBER} member={comment.owner} />
            </Box>
            <Box sx={{ width: '100%', pt: 1, }}>
              <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                  <TextField multiline rows={4}
                    sx={{ width: '100%'}} label="Update Comment"
                    {...getFieldProps('comment')} error={Boolean(touched && errors.comment)}
                    helperText={touched && errors.comment} />
                  <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                    <LoadingButton color="success" disabled={!(isValid && formik.dirty)}
                      type="submit" loading={isSubmitting} sx={{minWidth: '0', pl: 1}} >
                      <CheckIcon />
                    </LoadingButton>
                    <IconButton onClick={() => setDisplayEditTextCommentForm(false)}
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
        </>
      )}

      { !displayEditTextCommentForm && (
        <>
          <Permission code={PermissionCodes.COMMENT_OWNER} comment={comment} member={comment.owner}>

            <Stack spacing={3} direction={'row'} sx={{ width: '100%'}}>
              <Box>
                <ProjectMemberAvatar type={PermissionCodes.PROJECT_MEMBER} member={comment.owner} />
              </Box>
              <Typography onClick={() => setDisplayEditTextCommentForm(true)}>
                {comment.content}
              </Typography>
            </ Stack>
          </Permission>
          <NoPermission
            code={PermissionCodes.COMMENT_OWNER} comment={comment} member={comment.owner}>
            <Stack spacing={3} direction={'row'} sx={{ width: '100%'}}>

              <Box>
                <ProjectMemberAvatar type={PermissionCodes.PROJECT_MEMBER} member={comment.owner} />
              </Box>
              <Typography >  {comment.content} </Typography>
            </ Stack>
          </NoPermission>

        </>
      )}
    </>
  )
}

