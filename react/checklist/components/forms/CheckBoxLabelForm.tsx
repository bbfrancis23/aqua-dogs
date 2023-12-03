import { useContext, useState } from "react"
import { Box, TextField, TextFieldProps, Typography } from "@mui/material"
import axios from "axios"
import { Form, FormikProvider, useFormik } from "formik"
import { useSnackbar } from "notistack"
import * as Yup from 'yup'
import { ClickAwaySave, FormActions } from "@/fx/ui"
import { BoardContext } from "@/react/board"
import {ItemContext} from "@/react/item"
import { ProjectContext } from "@/react/project"
import {SectionContext} from "@/react/section"
import { FxCheckbox } from "@/react/checklist"


export interface CheckBoxLabelFormProps { checkbox: FxCheckbox}

const CheckBoxLabelForm = ({checkbox}: CheckBoxLabelFormProps) => {

  const [showForm, setShowForm] = useState(false)
  const {project} = useContext(ProjectContext)
  const {item, setItem} = useContext(ItemContext)
  const {section } = useContext(SectionContext)
  const {enqueueSnackbar} = useSnackbar()

  const formik = useFormik({
    initialValues: { label: checkbox.label },
    validationSchema: Yup.object().shape({label: Yup.string().required('')}),
    onSubmit: (data) => {
      const itemDir = `/api/members/projects/${project?.id}/items/${item?.id}`
      axios.patch(`${itemDir}/sections/${section?.id}/checkboxes/${checkbox.id}`,
        {label: data.label} )
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Ok ){
            formik.resetForm({values: {label: data.label}})
            setItem(res.data.item)
            enqueueSnackbar("Label Updated", {variant: "success"})
            setShowForm(false)
          }
        })
        .catch((e) => {
          formik.setSubmitting(false)
          enqueueSnackbar(e.response.data.message, {variant: "error"})
        })
    }
  })

  const {errors, touched, handleSubmit, getFieldProps} = formik

  const labelProps: TextFieldProps = {
    label: "label",
    size: 'small',
    sx: { width: '100%'},
    ...getFieldProps('label'),
    error: Boolean(touched && errors.label),
    helperText: touched && errors.label,
    autoFocus: true
  }

  const deleteCheckbox = () => {
    formik.setSubmitting(true)
    axios.delete(`/api/members/projects/${project?.id}/items/${item?.id}/sections/${section?.id}`)
      .then((res) => {
        setItem(res.data.item)
        enqueueSnackbar("Item Checklist Deleted", {variant: "success"})
        formik.setSubmitting(false)
      })
      .catch((e) => {
        enqueueSnackbar(e.response.data.message, {variant: "error"})
        formik.setSubmitting(false)
      })
  }

  return (
    <Box sx={{width: '100%'}}>
      { showForm && (
        <Box sx={{position: 'relative', top: '25px'}}>
          <FormikProvider value={formik}>
            <ClickAwaySave>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <TextField {...labelProps} />
                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                  <FormActions title={'Label'} onCancel={() => setShowForm(false)} />
                </Box>
              </Form>
            </ClickAwaySave>
          </FormikProvider>
        </Box>
      )}
      { !showForm && (
        <Typography sx={{pt: 1}} onClick={() => setShowForm(true)}>{checkbox.label}</Typography>
      ) }
    </Box>
  )
}

export default CheckBoxLabelForm

// QA: Brian Francis 12/3/23
