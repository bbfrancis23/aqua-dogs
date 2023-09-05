import { useContext, useState } from "react";

import { Box, IconButton, TextField, Typography } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';

import axios from "axios";
import { Form, FormikProvider, useFormik } from "formik";
import { useSnackbar } from "notistack";

import { ItemContext } from "@/interfaces/ItemInterface";
import { Member } from "@/interfaces/MemberInterface";
import { Project } from "@/interfaces/ProjectInterface";
import { Section } from "@/interfaces/SectionInterface";

import * as Yup from "yup"
import Permission, { NoPermission, PermissionCodes } from "@/ui/PermissionComponent";

export interface TextSectionProps {
  member: Member;
  project: Project;
  section: Section;
}

const editSectionSchema = Yup.object().shape({
  section: Yup.string().required('Section Content is required for your mom'),
})

export const TextSection = (props: TextSectionProps) => {
  const { member, project, section} = props

  const {item, setItem} = useContext(ItemContext)

  const {enqueueSnackbar} = useSnackbar()

  const [displayEditTextSectionForm, setDisplayEditTextSectionForm] = useState<boolean>(false)

  const handleDeleteSection = () => {

    axios.delete(`/api/members/projects/${project?.id}/items/${item?.id}/sections/${section.id}`)
      .then((res) => {
        setItem(res.data.item)
        enqueueSnackbar("Item Section Deleted", {variant: "success"})
      })
      .catch((e) => {
        enqueueSnackbar(e.response.data.message, {variant: "error"})
      })
  }


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

  const {errors, touched, handleSubmit, getFieldProps, isSubmitting, isValid} = formik

  console.log('item', item )
  console.log('member', member )


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
                <IconButton color="success" type="submit" disabled={!(isValid && formik.dirty)}>
                  <CheckIcon />
                </IconButton>
                <IconButton onClick={() => setDisplayEditTextSectionForm(false)}>
                  <CancelIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteSection()}>
                  <DeleteIcon color={'error'}/>
                </IconButton>
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

// QA: Brian Francis 8-23-23
