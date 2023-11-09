import { useContext, useState } from "react"
import { Box, TextField, TextFieldProps, Typography } from "@mui/material"
import axios from "axios"
import { Form, FormikProvider, useFormik } from "formik"
import { useSnackbar } from "notistack"
import { ItemContext } from "@/react/item"
import { ProjectContext } from "@/react/project/"
import { Section, sectionSchema } from "@/react/section"
import {Permission, NoPermission, ClickAwaySave, FormActions,
  PermissionCodes, FormActionsProps} from "@/fx/ui"
import { MemberContext } from "@/react/members"

export interface TextSectionProps { section: Section}

export const TextSection = ({section}: TextSectionProps) => {

  const {project} = useContext(ProjectContext)
  const {member} = useContext(MemberContext)

  const {item, setItem} = useContext(ItemContext)
  const {enqueueSnackbar} = useSnackbar()

  const [editSection, setEditSection] = useState<boolean>(false)

  const formik = useFormik({
    initialValues: { section: section.content },
    validationSchema: sectionSchema,
    onSubmit: (data) => {
      axios.patch(`/api/members/projects/${project?.id}/items/${item?.id}/sections/${section.id}`,
        {content: data.section, sectiontype: "63b2503c49220f42d9fc17d9"})
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Ok ){
            formik.resetForm({values: {section: data.section}})
            setItem(res.data.item)
            enqueueSnackbar("Item Section Updated", {variant: "success"})
            setEditSection(false)
          }
        })
        .catch((e) => {
          formik.setSubmitting(false)
          enqueueSnackbar(e.response.data.message, {variant: "error"})
        })
    }
  })

  const deleteSection = () => {
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

  const {errors, touched, handleSubmit, getFieldProps, isValid, dirty} = formik
  const textFieldProps: TextFieldProps = {
    multiline: true,
    rows: 3,
    sx: { width: '100%'},
    label: "Update Section",
    ...getFieldProps('section'),
    error: Boolean(touched && errors.section),
    helperText: touched && errors.section,
    autoFocus: true
  }

  const formActionsProps: FormActionsProps = {
    title: 'Section',
    onCancel: () => setEditSection(false),
    onDelete: deleteSection,
  }

  return (
    <>
      {editSection && (
        <Box sx={{ width: '100%', pt: 1, }}>
          <FormikProvider value={formik}>
            <ClickAwaySave>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <TextField {...textFieldProps} />
                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                  <FormActions {...formActionsProps} />
                </Box>
              </Form>
            </ClickAwaySave>
          </FormikProvider>
        </ Box>
      )}
      { !editSection && (
        <>
          <Permission code={PermissionCodes.ITEM_OWNER} item={item} member={member}>
            <Typography onClick={() => setEditSection(true)} >{section.content}</Typography>
          </Permission>
          <NoPermission code={PermissionCodes.ITEM_OWNER} item={item} member={member} >
            <Typography >{section.content}</Typography>
          </NoPermission>
        </>
      )}
    </>
  )
}

export default TextSection
// QA: Brian Francis 11-06-23
