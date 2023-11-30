import { useContext, useState } from "react"
import { Box, Checkbox, FormControlLabel, Stack, TextField,
  TextFieldProps, Typography } from "@mui/material"
import ChecklistIcon from '@mui/icons-material/Checklist'
import axios from "axios"
import { Form, FormikProvider, useFormik } from "formik"
import { useSnackbar } from "notistack"
import { ItemContext } from "@/react/item"
import { ProjectContext } from "@/react/project/"
import { Section, SectionTypes, sectionSchema } from "@/react/section"
import { ClickAwaySave, FormActions, FormActionsProps} from "@/fx/ui"
import Permission, { NoPermission, PermissionCodes} from "@/fx/ui/PermissionComponent"
import { MemberContext } from "@/react/members"
import ChecklistForm from "./forms/checklist/ChecklistForm"
import SectionContext from "../SectionContext"

export interface CheckListSectionProps { section: Section}

export const CheckListSection = ({section}: CheckListSectionProps) => {

  const {CHECKLIST} = SectionTypes

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
        {content: data.section, sectiontype: CHECKLIST})
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Ok ){
            formik.resetForm({values: {section: data.section}})
            setItem(res.data.item)
            enqueueSnackbar("Item Checklist Updated", {variant: "success"})
            setEditSection(false)
          }
        })
        .catch((e) => {
          formik.setSubmitting(false)
          enqueueSnackbar(e.response.data.message, {variant: "error"})
        })
    }
  })

  // const deleteSection = () => {
  //   formik.setSubmitting(true)
  //   axios.delete(`/api/members/projects/${project?.id}/items/${item?.id}/sections/${section.id}`)
  //     .then((res) => {
  //       setItem(res.data.item)
  //       enqueueSnackbar("Item Checklist Deleted", {variant: "success"})
  //       formik.setSubmitting(false)
  //     })
  //     .catch((e) => {
  //       enqueueSnackbar(e.response.data.message, {variant: "error"})
  //       formik.setSubmitting(false)
  //     })
  // }

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

  const formActionsProps: FormActionsProps = {
    title: 'Checklist',
    onCancel: () => setEditSection(false),
  }

  return (
    <>
      <SectionContext.Provider value={{section, setSection: () => {}}}>
        {editSection && (
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
        )}
        { !editSection && (
          <Stack direction={'row'} spacing={2}>
            <ChecklistIcon />
            <Permission code={PermissionCodes.ITEM_OWNER} item={item} member={member}>
              <Typography onClick={() => setEditSection(true)} >{section.content}</Typography>
            </Permission>
            <NoPermission code={PermissionCodes.ITEM_OWNER} item={item} member={member} >
              <Typography >{section.content}</Typography>
            </NoPermission>
          </Stack>
        )}
        <Stack sx={{ '&.MuiStack-root': {mt: 1}, borderRadius: 1,
          p:2, border: '1px solid', borderColor: 'divider', width: '100%'}}>

          {
            section?.checkboxes?.map((c, i) => (
              <Stack direction={'row'} key={i}>
                <Checkbox size="small"/> <Typography sx={{pt: 1}}>{c.label}</Typography>
              </Stack>
            ))

          }
          <ChecklistForm />
        </Stack>
      </SectionContext.Provider>
    </>
  )
}

export default CheckListSection
// QA: Brian Francis 11-06-23