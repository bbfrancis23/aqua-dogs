import { ItemContext } from "@/interfaces/ItemInterface";
import { Member } from "@/interfaces/MemberInterface";
import { Project } from "@/interfaces/ProjectInterface";
import { Section } from "@/interfaces/SectionInterface";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import axios from "axios";
import { Form, FormikProvider, useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useContext, useState } from "react";
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';


import * as Yup from "yup"

export interface TextSectionProps {
  member: Member;
  project: Project;
  section: Section;
}

const editSectionSchema = Yup.object().shape({
  section: Yup.string().required('Section Content is required'),
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
      axios.patch(`/api/projects/${project?.id}/items/${item?.id}/sections/${section.id}`,
        {content: data.section, sectiontype: "63b2503c49220f42d9fc17d9"})
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Ok ){
            setItem(res.data.item)
            enqueueSnackbar("Item Section Updated", {variant: "success"})
            formik.resetForm()
            setDisplayEditTextSectionForm(false);
          }
        })
        .catch((error) => {
          formik.setSubmitting(false)
          enqueueSnackbar(error.message, {variant: "error"})
        })
    }
  })

  const {errors, touched, handleSubmit, getFieldProps, isSubmitting, isValid} = formik

  return (
    <>
      {
        displayEditTextSectionForm && (
          <Box sx={{ width: '100%'}}>
            <FormikProvider value={formik}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <TextField multiline rows={4} sx={{ width: '100%'}}
                  label="Update Section" {...getFieldProps('section')}
                  error={Boolean(touched && errors.section)}
                  helperText={touched && errors.section}
                />
                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                  <IconButton color="success" type="submit" disabled={!(isValid && formik.dirty)}>
                    <CheckIcon />
                  </IconButton>
                  <IconButton onClick={() => setDisplayEditTextSectionForm(false)}>
                    <CancelIcon />
                  </IconButton>
                  <IconButton onClick={() => setDisplayEditTextSectionForm(false)}>
                    <DeleteIcon color={'error'}/>
                  </IconButton>
                </Box>
              </Form>
            </FormikProvider>
          </ Box>
        )
      }
      {
        !displayEditTextSectionForm && (
          <Typography
            onClick={() => setDisplayEditTextSectionForm(true)} >
            {section.content}
          </Typography>
        )
      }
    </>
  )
}


