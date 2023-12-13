import { useContext, useState } from "react"
import { ClickAwaySave, FormActions, FormActionsProps } from "@/fx/ui"
import { Box, Button, Checkbox, Stack, TextField, TextFieldProps } from "@mui/material"
import { useSnackbar } from "notistack"
import axios from "axios"
import { FormikProvider, useFormik, Form } from "formik"
import * as Yup from 'yup'
import {SectionContext, SectionTypes} from "@/react/section"
import { ProjectContext } from "@/react/project"
import { ItemContext } from "@/react/item"

const CheckBoxForm = () => {

  const {CHECKLIST} = SectionTypes
  const {section} = useContext(SectionContext)
  const {project} = useContext(ProjectContext)
  const {item, setItem} = useContext(ItemContext)
  const [showAddCheckbox, setShowAddCheckbox] = useState<boolean>(false)

  const {enqueueSnackbar} = useSnackbar()

  const formik = useFormik({
    initialValues: { label: '' },
    validationSchema: Yup.object().shape({label: Yup.string().required('label is required')}),
    onSubmit: (data) => {

      axios.patch(`/api/members/projects/${project?.id}/items/${item?.id}/sections/${section?.id}`,
        {label: data.label, sectiontype: CHECKLIST})
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Ok ){
            formik.resetForm({values: {label: data.label}})
            setItem(res.data.item)
            enqueueSnackbar("Item Checklist Updated", {variant: "success"})
            setShowAddCheckbox(false)
          }
        })
        .catch((e) => {
          formik.setSubmitting(false)
          enqueueSnackbar(e, {variant: "error"})
        })
    }
  })

  const { handleSubmit, getFieldProps} = formik

  const checkboxLabelProps: TextFieldProps = {
    sx: { width: '100%'},
    autoFocus: true,
    multiline: false,
    label: "Checkbox label",
    size: 'small',
    ...getFieldProps('label'),
  }

  const formActionsProps: FormActionsProps = {
    title: 'Checkbox Label',
    onCancel: () => setShowAddCheckbox(false),
  }

  return (
    <>
      { showAddCheckbox ? (
        <Box >
          <FormikProvider value={formik}>
            <ClickAwaySave {...formActionsProps}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Stack direction={'row'} >
                  <><Checkbox disabled/><TextField {...checkboxLabelProps} /></>
                </Stack>
                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                  <FormActions {...formActionsProps} />
                </Box>
              </ Form>
            </ClickAwaySave>
          </FormikProvider>
        </Box> )
        : (
          <Box>
            <Button onClick={() => setShowAddCheckbox(true)} variant={'contained'}>
            Add Checkbox
            </Button>
          </Box>
        )
      }
    </>
  )
}

export default CheckBoxForm