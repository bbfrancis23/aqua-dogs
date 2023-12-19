import { useContext } from "react"
import { Box, TextField, TextFieldProps } from "@mui/material"
import axios from "axios"
import { useSnackbar } from "notistack"
import { ClickAwaySave, FormActions, FormActionsProps } from "@/fx/ui"
import { ItemContext } from "@/react/item"
import { ProjectContext } from "@/react/project"
import { SectionTypes, SectionContext, sectionSchema } from "@/react/section"
import { Form, FormikProvider, useFormik } from "formik"

interface CheckListTitleFormProps { closeForm: () => void }

export const CheckListTitleForm = ({closeForm}: CheckListTitleFormProps) => {

  const {CHECKLIST} = SectionTypes

  const {section} = useContext(SectionContext)
  const {project} = useContext(ProjectContext)
  const {item, setItem} = useContext(ItemContext)
  const {enqueueSnackbar} = useSnackbar()

  const formik = useFormik({
    initialValues: { section: section?.content },
    validationSchema: sectionSchema,
    onSubmit: (data) => {
      axios.patch(`/api/members/projects/${project?.id}/items/${item?.id}/sections/${section?.id}`,
        {content: data.section, sectiontype: CHECKLIST})
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Ok ){
            formik.resetForm({values: {section: data.section}})
            setItem(res.data.item)
            enqueueSnackbar("Item Checklist Updated", {variant: "success"})
            closeForm()
          }
        })
        .catch((e) => {
          formik.setSubmitting(false)
          enqueueSnackbar(e.response.data.message, {variant: "error"})
        })
    }
  })

  const {errors, touched, handleSubmit, getFieldProps} = formik

  const checkListProps: TextFieldProps = {
    sx: { width: '100%'},
    ...getFieldProps('section'),
    error: Boolean(touched && errors.section),
    autoFocus: true,
    multiline: false,
    label: "Checklist Title",
    size: 'small',
  }

  const deleteSection = () => {
    formik.setSubmitting(true)
    axios.delete(`/api/members/projects/${project?.id}/items/${item?.id}/sections/${section?.id}`)
      .then((res) => {
        console.log('deleted')
        setItem(res.data.item)
        enqueueSnackbar("Item Checklist Deleted", {variant: "success"})
        formik.setSubmitting(false)
        closeForm()
      })
      .catch((e) => {
        enqueueSnackbar(e.response.data.message, {variant: "error"})
        formik.setSubmitting(false)
      })
  }

  const formActionsProps: FormActionsProps = {
    title: 'Checklist',
    onCancel: () => closeForm(),
    onDelete: deleteSection,
  }

  return (
    <Box sx={{ width: '100%', pt: 1, }}>
      <FormikProvider value={formik}>
        <ClickAwaySave>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <TextField {...checkListProps} />
            <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
              <FormActions {...formActionsProps} />
            </Box>
          </Form>
        </ClickAwaySave>
      </FormikProvider>
    </ Box>
  )
}

export default CheckListTitleForm

//QA: Brian Francis 12-03-23