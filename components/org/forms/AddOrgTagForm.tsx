import { useState } from "react";

import { Badge, Box, Button, IconButton, TextField, Tooltip } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import TagIcon from '@mui/icons-material/Sell';
import AddIcon from '@mui/icons-material/Add';

import { Form, FormikProvider, useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup"
import { useSnackbar } from "notistack";


const AddTagSchema = Yup.object().shape({ tag: Yup.string().required("Tag is required")})

export interface AddOrgTagFormProps{

}

export default function AddOrgTagForm(props: AddOrgTagFormProps) {

  const [displayForm, setDisplayForm] = useState<boolean>(false);

  const {enqueueSnackbar} = useSnackbar()

  const formik = useFormik({
    initialValues: { tag: '' },
    validationSchema: AddTagSchema,
    onSubmit: (data) => {
      axios.patch( `/api/org/-1`, {addTag: data.tag}, )
        .then((res) => {
          formik.setSubmitting(false)
          formik.resetForm()
          if (res.status === axios.HttpStatusCode.Ok ){
            enqueueSnackbar("Org Tag Added", {variant: "success"})

            setDisplayForm(false)
          }else{
            enqueueSnackbar(res.data.message, {variant: "error"})
          }
        })
        .catch((error) => {
          formik.setSubmitting(false)
          formik.resetForm()
          enqueueSnackbar(error, {variant: "error"})
        })
    }
  })

  const {errors, touched, setFieldValue, initialValues,
    handleSubmit, getFieldProps, isSubmitting, isValid} = formik

  return (
    <>
      { displayForm === false && (
        <Tooltip title="Add Org Tag">
          <IconButton
            size="small" sx={{ ml: 1}}
            onClick={() => setDisplayForm(true) }>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
              badgeContent={
                <AddIcon fontSize="small" sx={{ fontSize: ".90rem", fontWeight: '900'}}
                  style={{ position: 'relative', left: '-7px', bottom: '-7'}}/>
              } >
              < TagIcon />
            </Badge>
          </IconButton>
        </Tooltip>
      )}
      { displayForm === true && (

        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Box sx={{ ml: 1, display: 'flex'}}>
              <TextField

                size={'small'}
                label="New Tag"
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
              <Button onClick={() => setDisplayForm(false)} >Cancel</Button></Box>
            </ Box>
          </Form>
        </FormikProvider>
      )}
    </>
  )
}