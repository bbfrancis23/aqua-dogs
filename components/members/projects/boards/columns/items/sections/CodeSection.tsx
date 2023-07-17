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
import dynamic from "next/dynamic"
const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  {ssr: false}
)

/*eslint-disable */

import * as Yup from "yup"
import Permission, { NoPermission, PermissionCodes } from "@/ui/permission/Permission";

export interface TextSectionProps {
  member: Member;
  project: Project;
  section: Section;
}

const editSectionSchema = Yup.object().shape({
  section: Yup.string().required('Section Content is required'),
})

export const CodeSection = (props: TextSectionProps) => {
  const { member, project, section} = props

  const {item, setItem} = useContext(ItemContext)


  const {enqueueSnackbar} = useSnackbar()

  const [displayEditTextSectionForm, setDisplayEditTextSectionForm] = useState<boolean>(false)

  const handleDeleteSection = () => {

    axios.delete(`/api/projects/${project?.id}/items/${item?.id}/sections/${section.id}`)
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
      axios.patch(`/api/projects/${project?.id}/items/${item?.id}/sections/${section.id}`,
        {content: data.section, sectiontype: "63b88d18379a4f30bab59bad"})
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Ok ){
            setItem(res.data.item)
            enqueueSnackbar("Item Section Updated", {variant: "success"})
            formik.resetForm()
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

  return (
    <>
      {
        displayEditTextSectionForm && (
          <Box sx={{ width: '100%'}}>
            <FormikProvider value={formik}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <CodeEditor
                  language="jsx"
                  placeholder="Create Code Section"
                  {...getFieldProps('section')}
                  padding={15}
                  style={{ width: '100%', fontSize: 12, backgroundColor: "#f5f5f5",
                    fontFamily:
                      "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace"
                  }}
                />
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
        )
      }
      {
        !displayEditTextSectionForm && (
          <>
            <Permission code={PermissionCodes.ITEM_OWNER} item={item} member={member}>
              <CodeEditor
              onClick={() => setDisplayEditTextSectionForm(true)}
                key={section.id}
                value={section.content}
                language="jsx"
                readOnly
                padding={15}
                style={{
                  width: '100%',
                  fontSize: 12,
                  backgroundColor: "#f5f5f5",
                  fontFamily:
                            "ui-monospace,SF Mono,Consolas,Liberation Mono,Menlo,monospace"
                }}
              />
            </Permission>
            <NoPermission code={PermissionCodes.ITEM_OWNER} item={item} member={member}>
              <CodeEditor
                onClick={() => setDisplayEditTextSectionForm(true)}
                key={section.id}
                value={section.content}
                language="jsx"
                readOnly
                padding={15}
                style={{
                  width: '100%',
                  fontSize: 12,
                  backgroundColor: "#f5f5f5",
                  fontFamily:
                            "ui-monospace,SF Mono,Consolas,Liberation Mono,Menlo,monospace"
                }}
              />
            </NoPermission>

          </>
        )
      }
    </>
  )
}