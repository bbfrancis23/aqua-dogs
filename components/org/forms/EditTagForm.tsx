import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Box, Button, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";

import { Form, FormikProvider, useFormik, Formik } from "formik";

import axios from "axios";
import * as Yup from "yup"

import { Tag } from "../../../interfaces/TagInterface"
import { Member } from "../../../interfaces/MemberInterface";


const EditTagSchema = Yup.object().shape({ tag: Yup.string().required("Tag is required")})

export interface EditTagFormProps{
  tag: Tag;
  setMember: Dispatch<SetStateAction<Member>>;
  displayForm: boolean;
  hideForm: () => void
}

const EditTagForm = (props: EditTagFormProps) => {
  const {setMember, displayForm, hideForm, tag} = props


  const {enqueueSnackbar} = useSnackbar()


  const formik = useFormik({
    initialValues: { tag: tag.title },
    validationSchema: EditTagSchema,
    onSubmit: (data) => {
      axios.patch( `/api/tags/${tag.id}`, {title: data.tag}, )
        .then((res) => {
          formik.setSubmitting(false)
          formik.resetForm()
          if (res.status === axios.HttpStatusCode.Ok ){
            enqueueSnackbar("Member Tag Edited", {variant: "success"})
            setMember(res.data.member);
            hideForm()
          }else{
            enqueueSnackbar(res.data.message, {variant: "error"})
          }
        })
        .catch((error) => {
          formik.setSubmitting(false)
          formik.resetForm()
          enqueueSnackbar(error, {variant: "error"})
        })
      formik.setSubmitting(false)
    }
  })


  useEffect( () => {

    formik.setFieldValue('tag', tag.title)
  }, [tag])


  const {errors, touched,
    handleSubmit, getFieldProps, isSubmitting, isValid, } = formik

  return (
    <>
      {
        displayForm && (
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Box sx={{ ml: 1, display: 'flex'}}>
                <TextField

                  size={'small'}
                  label="Edit Tag"
                  {...getFieldProps('tag')}
                  error={Boolean(touched && errors.tag)}
                  helperText={touched && errors.tag}
                />
                <Box><LoadingButton
                  color="success"
                  disabled={!(isValid && formik.dirty)}
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  sx={{mr: 1, ml: 1}}
                >
                Save
                </LoadingButton>
                <Button onClick={() => hideForm()} >Cancel</Button></Box>
              </ Box>
            </Form>
          </FormikProvider>
        )
      }
    </>
  )
}

export default EditTagForm