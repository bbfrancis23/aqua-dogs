import { useContext, useState } from "react";

import { Box, IconButton, TextField, Typography } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';

import axios from "axios";
import { Form, FormikProvider, useFormik } from "formik";
import { useSnackbar } from "notistack";

import { ItemContext } from "@/react/item/ItemContext";
import { Member } from "@/react/members/member-types";
import { Project } from "@/react/project/";
import { Section } from "@/react/section/section-types";

import * as Yup from "yup"
import Permission, { NoPermission, PermissionCodes } from "fx/ui/PermissionComponent";
import { LoadingButton } from "@mui/lab";

export interface TextSectionProps {
  member: Member;
  project: Project;
  section: Section;
}

const editSectionSchema = Yup.object().shape({
  section: Yup.string().required('Section Content is required.'),
})

export const TextSection = (props: TextSectionProps) => {
  const { member, project, section} = props

  const {item, setItem} = useContext(ItemContext)

  const {enqueueSnackbar} = useSnackbar()

  const [displayEditTextSectionForm, setDisplayEditTextSectionForm] = useState<boolean>(false)


  const formik = useFormik({
    initialValues: { section: section.content },
    validationSchema: editSectionSchema,
    onSubmit: (data) => {
      axios.patch(`/api/members/projects/${project?.id}/items/${item?.id}/sections/${section.id}`,
        {content: data.section, sectiontype: "63b2503c49220f42d9fc17d9"})
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Ok ){
            formik.resetForm({values: {section: data.section}})
            setItem(res.data.item)
            enqueueSnackbar("Item Section Updated", {variant: "success"})
            setDisplayEditTextSectionForm(false);
          }
        })
        .catch((e) => {
          formik.setSubmitting(false)
          enqueueSnackbar(e.response.data.message, {variant: "error"})
        })
    }
  })

  const handleDeleteSection = () => {
    formik.setSubmitting(true)
    axios.delete(`/api/members/projects/${project?.id}/items/${item?.id}/sections/${section.id}`)
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
      {displayEditTextSectionForm && (
        <Box sx={{ width: '100%', pt: 1, }}>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <TextField multiline rows={10}
                sx={{ width: '100%'}} label="Update Section"
                {...getFieldProps('section')} error={Boolean(touched && errors.section)}
                helperText={touched && errors.section} />
              <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                <LoadingButton color="success" disabled={!(isValid && formik.dirty)} type="submit"
                  loading={isSubmitting} sx={{minWidth: '0', pl: 1}} >
                  <CheckIcon />
                </LoadingButton>
                <IconButton onClick={() => setDisplayEditTextSectionForm(false)}
                  sx={{minWidth: '0', pl: 1}}>
                  <CancelIcon />
                </IconButton>
                <LoadingButton sx={{minWidth: '0', pl: 1}} loading={isSubmitting}
                  onClick={() => handleDeleteSection()}>
                  { isSubmitting ? '' : <DeleteIcon color={'error'}/>}
                </LoadingButton>
              </Box>
            </Form>
          </FormikProvider>
        </ Box>
      )}
      { !displayEditTextSectionForm && (
        <>
          <Permission code={PermissionCodes.ITEM_OWNER} item={item} member={member}>
            <Typography
              onClick={() => setDisplayEditTextSectionForm(true)} >
              {section.content}
            </Typography>
          </Permission>
          <NoPermission code={PermissionCodes.ITEM_OWNER} item={item} member={member} >
            <Typography >
              {section.content}
            </Typography>
          </NoPermission>

        </>
      )}
    </>
  )
}

export default TextSection
// QA: Brian Francis 8-23-23
