
import { useContext, useState } from "react";

import { Box, Button, ButtonGroup, IconButton, Stack, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';

import * as Yup from "yup"

import { ItemContext } from "@/react/item/ItemContext";
import { Member } from "@/react/members/member-types";
import { ProjectContext } from "@/react/project/project-types";

import SectionStub from "../sections/SectionStub";

export interface CreateSectionFormProps {
  member: Member;
}

const createSectionSchema = Yup.object().shape({
  section: Yup.string().required('Section Content is required'),
})

import dynamic from "next/dynamic"
import "@uiw/react-textarea-code-editor/dist.css"
import axios from "axios";
import { Form, FormikProvider, useFormik } from "formik";
import Permission, { PermissionCodes } from "fx/ui/PermissionComponent";
import { LoadingButton } from "@mui/lab";
const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  {ssr: false}
)

const CreateSectionForm = (props: CreateSectionFormProps) => {

  const { member} = props;
  const {enqueueSnackbar} = useSnackbar()
  const {item, setItem} = useContext(ItemContext)
  const {project} = useContext(ProjectContext)

  const [displayForm, setDisplayForm] = useState<boolean>(false)
  const [sectionType, setSectionType] = useState("text")

  const formik = useFormik({
    initialValues: { section: '' },
    validationSchema: createSectionSchema,
    onSubmit: (data) => {
      axios.post(`/api/members/projects/${project?.id}/items/${item?.id}/sections`,
        {content: data.section, sectiontype: sectionType === "text" ?
          "63b2503c49220f42d9fc17d9" : "63b88d18379a4f30bab59bad",})
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Ok ){
            setItem(res.data.item)
            enqueueSnackbar("Item Section Created", {variant: "success"})
            formik.resetForm()
            setDisplayForm(false);
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
      {displayForm && (
        <Stack spacing={3} sx={{ width: '100%'}}>
          <ButtonGroup>
            <Button variant={sectionType === "text" ? "contained" : "outlined"}
              onClick={() => setSectionType("text")}>
                T
            </Button>
            <Button
              variant={sectionType === "code" ? "contained" : "outlined"}
              onClick={() => setSectionType("code")}
            >
              {"{}"}
            </Button>
          </ButtonGroup>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              { sectionType === "text" && (
                <TextField multiline rows={4} sx={{ width: '100%'}}
                  label="Create Section" {...getFieldProps('section')}
                  error={Boolean(touched && errors.section)}
                  helperText={touched && errors.section}
                />
              )}
              { sectionType === "code" && (
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
              ) }
              <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                <LoadingButton color="success" disabled={!(isValid && formik.dirty)} type="submit"
                  loading={isSubmitting} sx={{minWidth: '0', pl: 1}} >
                  <CheckIcon />
                </LoadingButton>
                <IconButton onClick={() => setDisplayForm(false)}>
                  <CancelIcon />
                </IconButton>
              </Box>
            </Form>
          </FormikProvider>
        </Stack>
      )
      }
      { ! displayForm && (
        <Permission code={PermissionCodes.ITEM_OWNER} item={item} member={member}>
          <Box sx={{ width: '100%', cursor: 'pointer'}} onClick={() => setDisplayForm(true)} >
            <SectionStub />
          </Box>
        </Permission>
      )}
    </>
  )
}

export default CreateSectionForm

// QA Brian Francis 8-23-23