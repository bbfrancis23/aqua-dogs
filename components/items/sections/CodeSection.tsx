import { useContext, useState } from "react"
import dynamic from "next/dynamic"

import { Box, IconButton } from "@mui/material"
import { useSnackbar } from "notistack"
import CheckIcon from '@mui/icons-material/Check'
import CancelIcon from '@mui/icons-material/Cancel'
import DeleteIcon from '@mui/icons-material/Delete'

import axios from "axios"
import { Form, FormikProvider, useFormik } from "formik"
import * as Yup from "yup"

import Permission, { NoPermission, PermissionCodes } from "@/ui/PermissionComponent"

import { ItemContext } from "@/interfaces/ItemInterface"
import { Member } from "@/interfaces/MemberInterface"
import { Project } from "@/interfaces/ProjectInterface"
import { Section } from "@/interfaces/SectionInterface"
import { LoadingButton } from "@mui/lab"

const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  {ssr: false}
)

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
  const [displayEditCodeSectionForm, setDisplayEditCodeSectionForm] = useState<boolean>(false)

  const {enqueueSnackbar} = useSnackbar()


  const formik = useFormik({
    initialValues: { section: section.content },
    validationSchema: editSectionSchema,
    onSubmit: (data) => {
      axios.patch(`/api/members/projects/${project?.id}/items/${item?.id}/sections/${section.id}`,
        {content: data.section, sectiontype: "63b88d18379a4f30bab59bad"})
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Ok ){
            setItem(res.data.item)
            enqueueSnackbar("Item Section Updated", {variant: "success"})
            formik.resetForm()
            setDisplayEditCodeSectionForm(false);
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
      { displayEditCodeSectionForm && (
        <Box sx={{ width: '100%', color: '#ff0000'}}>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>


              <CodeEditor language="jsx" placeholder="Create Code Section"
                {...getFieldProps('section')} padding={15}
                style={{ width: '100%', fontSize: 12, backgroundColor: "#f5f5f5",
                  color: "#000000",
                  fontFamily:
                  "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace" }}
              />

              <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                <LoadingButton color="success" disabled={!(isValid && formik.dirty)} type="submit"
                  loading={isSubmitting} sx={{minWidth: '0', pl: 1}} >
                  <CheckIcon />
                </LoadingButton>
                <IconButton onClick={() => setDisplayEditCodeSectionForm(false)}
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
      ) }
      { !displayEditCodeSectionForm && (
        <>
          <Permission code={PermissionCodes.ITEM_OWNER} item={item} member={member}>

            <CodeEditor onClick={() => setDisplayEditCodeSectionForm(true)}
              key={section.id} value={section.content} language="jsx" readOnly padding={15}
              style={{ width: '100%', fontSize: 12, backgroundColor: "#f5f5f5", color: "#000",
                fontFamily: "ui-monospace,SF Mono,Consolas,Liberation Mono,Menlo,monospace" }} />
          </Permission>
          <NoPermission code={PermissionCodes.ITEM_OWNER} item={item} member={member}>
            <CodeEditor key={section.id}
              value={section.content} language="jsx" readOnly padding={15}
              style={{ width: '100%', fontSize: 12, backgroundColor: "#f5f5f5", color: "#000",
                fontFamily:"ui-monospace,SF Mono,Consolas,Liberation Mono,Menlo,monospace" }} />
          </NoPermission>
        </>
      ) }
    </>
  )
}

export default CodeSection
// QA Brian Francis 8-23-23