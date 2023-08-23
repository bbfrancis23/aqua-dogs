import { useState, Dispatch, SetStateAction, } from "react";

import { Badge, Box, Button, IconButton, TextField, Tooltip } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import TagIcon from '@mui/icons-material/Sell';
import AddIcon from '@mui/icons-material/Add';

import { Form, FormikProvider, useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup"
import { useSnackbar } from "notistack";
import { Member } from "../../../interfaces/MemberInterface";

export interface AddMemberTagFormProps{
  setMember: Dispatch<SetStateAction<Member>>;
}

export default function AddMemberTagForm(props: AddMemberTagFormProps) {

  const {setMember} = props

  const [displayForm, setDisplayForm] = useState<boolean>(false);

  const {enqueueSnackbar} = useSnackbar()

  const formik = useFormik({
    initialValues: { tag: '' },
    validationSchema: {},
    onSubmit: (data) => {
      axios.patch( '/api/auth/member', {addTag: data.tag}, )
        .then((res) => {
          formik.setSubmitting(false)
          formik.resetForm()
          if (res.status === axios.HttpStatusCode.Ok ){
            enqueueSnackbar("Member Tag Added", {variant: "success"})
            setMember(res.data.member);
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
      formik.setSubmitting(false)
    }
  })

  const {errors, touched, setFieldValue, initialValues,
    handleSubmit, getFieldProps, isSubmitting, isValid} = formik

  return (
    <>
      { displayForm === false && (
        <Tooltip title="Add Tag">
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
              <TagIcon fontSize="small"/>
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