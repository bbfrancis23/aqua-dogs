import { useContext, useState } from "react"
import { Box } from "@mui/material"
import { useSnackbar } from "notistack"
import axios from "axios"
import { Form, FormikProvider, useFormik } from "formik"
import {Permission, NoPermission, PermissionCodes, FxCodeEditor} from "@/fx/ui"
import FormActions, {ClickAwaySave, FormActionsProps } from "@/fx/ui/FormActions"
import { ItemContext } from "@/react/item"
import { ProjectContext } from "@/react/project/"
import { Section, SectionTypes, sectionSchema } from "@/react/section"
import { MemberContext } from "@/react/members"

export interface TextSectionProps { section: Section}

export const CodeSection = (props: TextSectionProps) => {

  const { section} = props
  const {project} = useContext(ProjectContext)
  const {member} = useContext(MemberContext)
  const {item, setItem} = useContext(ItemContext)
  const [editForm, setEditForm] = useState<boolean>(false)

  const {enqueueSnackbar} = useSnackbar()

  const title = "Code Section"

  const formik = useFormik({
    initialValues: { section: section.content },
    validationSchema: sectionSchema,
    onSubmit: (data) => {
      const sectionDir = `/api/members/projects/${project?.id}/items/${item?.id}/sections`
      const code = SectionTypes.CODE
      axios.patch(`${sectionDir}/${section.id}`, {content: data.section, sectiontype: code})
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Ok ){
            formik.resetForm({values: {section: data.section}})
            setItem(res.data.item)
            enqueueSnackbar(`${title} Updated`, {variant: "success"})
            formik.resetForm()
            setEditForm(false)
          }
        })
        .catch((e) => {
          formik.setSubmitting(false)
          enqueueSnackbar(`Error updating ${title} ${e.response.data.message}`, {variant: "error"})
        })
    }
  })

  const deleteSection = () => {
    formik.setSubmitting(true)
    axios.delete(`/api/members/projects/${project?.id}/items/${item?.id}/sections/${section.id}`)
      .then((res) => {
        setItem(res.data.item)
        enqueueSnackbar(`${title} Deleted`, {variant: "success"})
        formik.setSubmitting(false)
      })
      .catch((e) => {
        enqueueSnackbar(`Error updating ${title} ${e.response.data.message}`, {variant: "error"})
        formik.setSubmitting(false)
      })
  }

  const {handleSubmit, getFieldProps} = formik

  const formActionsProps: FormActionsProps = {
    title,
    onCancel: () => setEditForm(false),
    onDelete: deleteSection
  }

  return (
    <>
      { editForm && (
        <Box sx={{ width: '100%', color: '#ff0000'}}>
          <FormikProvider value={formik}>
            <ClickAwaySave>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <FxCodeEditor placeholder="Code Section" {...getFieldProps('section')} autoFocus/>
                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                  <FormActions {...formActionsProps} />
                </Box>
              </Form>
            </ClickAwaySave >
          </FormikProvider>
        </ Box>
      ) }
      { !editForm && (
        <>
          <Permission code={PermissionCodes.ITEM_OWNER} item={item} member={member}>
            <FxCodeEditor onClick={() => setEditForm(true)} value={section.content} />
          </Permission>
          <NoPermission code={PermissionCodes.ITEM_OWNER} item={item} member={member}>
            <FxCodeEditor value={section.content} readOnly />
          </NoPermission>
        </>
      ) }
    </>
  )
}

export default CodeSection
// QA Brian Francis 8-23-23