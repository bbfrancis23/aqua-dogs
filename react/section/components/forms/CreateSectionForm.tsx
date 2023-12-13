import { useContext, useState } from "react"
import { Box, ButtonGroup, Stack, TextField, TextFieldProps } from "@mui/material"
import Button, { ButtonProps} from "@mui/material/Button"
import TextAreaIcon from '@mui/icons-material/ViewHeadline'
import CodeIcon from '@mui/icons-material/DataObject'
import ChecklistIcon from '@mui/icons-material/Checklist'
import { useSnackbar } from "notistack"
import axios from "axios"
import { Form, FormikProvider, useFormik } from "formik"
import { ItemContext } from "@/react/item"
import { MemberContext } from "@/react/members"
import { ProjectContext } from "@/react/project"
import {SectionStub, SectionTypes, sectionSchema} from "@/react/section"
import {Permission, PermissionCodes, FxCodeEditor, FormActions, ClickAwaySave } from "@/fx/ui"

const CreateSectionForm = () => {

  const { member} = useContext(MemberContext)
  const {enqueueSnackbar} = useSnackbar()
  const {item, setItem} = useContext(ItemContext)
  const {project} = useContext(ProjectContext)

  const {CODE, TEXT, CHECKLIST} = SectionTypes
  const [createSection, setCreateSection] = useState<boolean>(false)
  const [sectionType, setSectionType] = useState(TEXT)

  const formik = useFormik({
    initialValues: { section: '' },
    validationSchema: sectionSchema,
    onSubmit: (data) => {
      const sectionDir = `/api/members/projects/${project?.id}/items/${item?.id}/sections`
      axios.post(sectionDir, {content: data.section, sectiontype: sectionType})
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Ok ){
            setItem(res.data.item)
            enqueueSnackbar("Section Created", {variant: "success"})
            formik.resetForm()
            setCreateSection(false)
          }
        })
        .catch((error) => {
          formik.setSubmitting(false)
          enqueueSnackbar(error.message, {variant: "error"})
        })
    }
  })

  const {errors, touched, handleSubmit, getFieldProps} = formik

  const textButtonProps:ButtonProps = {
    variant: sectionType === TEXT ? "contained" : "outlined",
    onClick: () => setSectionType(TEXT)
  }

  const codeButtonProps:ButtonProps = {
    variant: sectionType === CODE ? "contained" : "outlined",
    onClick: () => setSectionType(CODE)
  }

  const checklistButtonProps:ButtonProps = {
    variant: sectionType === CHECKLIST ? "contained" : "outlined",
    onClick: () => setSectionType(CHECKLIST)
  }

  const sectionProps: TextFieldProps = {
    sx: { width: '100%'},
    ...getFieldProps('section'),
    error: Boolean(touched && errors.section),
    helperText: touched && errors.section,
    autoFocus: true
  }

  const checkListProps: TextFieldProps = {
    label: "Checklist Title",
    size: 'small',
    ...sectionProps
  }

  const textFieldProps: TextFieldProps = {
    multiline: true,
    rows: 4,
    label: "Create Section",
    ...sectionProps
  }

  return (
    <>
      {createSection && (
        <Box sx={{ width: '100%'}}>
          <FormikProvider value={formik}>
            <ClickAwaySave>
              <Stack spacing={3}>
                <ButtonGroup>
                  <Button {...textButtonProps}><TextAreaIcon /></Button>
                  <Button {...codeButtonProps}><CodeIcon /></Button>
                  <Button {...checklistButtonProps}><ChecklistIcon /></Button>
                </ButtonGroup>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                  { sectionType === TEXT && ( <TextField {...textFieldProps} /> )}
                  { sectionType === CHECKLIST && ( <TextField {...checkListProps} /> )}
                  { sectionType === CODE && (
                    <FxCodeEditor placeholder="Create Code" {...getFieldProps('section')}
                      autoFocus/>
                  ) }
                  <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                    <FormActions title={'Section'} onCancel={() => setCreateSection(false)} />
                  </Box>
                </Form>
              </Stack>
            </ClickAwaySave>
          </FormikProvider>
        </Box>
      )
      }
      { ! createSection && (
        <Permission code={PermissionCodes.ITEM_OWNER} item={item} member={member}>
          <Box sx={{ width: '100%', cursor: 'pointer'}} onClick={() => setCreateSection(true)} >
            <SectionStub />
          </Box>
        </Permission>
      )}
    </>
  )
}

export default CreateSectionForm

// QA Brian Francis 11-06-23