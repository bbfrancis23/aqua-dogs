
import { useEffect, useState } from "react"

import { Autocomplete, Box, Button, IconButton, TextField, Tooltip } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import AddMemberIcon from '@mui/icons-material/PersonAdd';

import { useSnackbar } from "notistack"

import axios from "axios"
import {FormikProvider, useFormik, Form} from "formik"
import * as Yup from "yup"
import { Member } from "../../../interfaces/MemberInterface";

const AddMemberSchema = Yup.object().shape({ member: Yup.string().required("Member is required")})

export interface AddOrgMemberFormProps {

}

export default function AddOrgMemberForm(props: AddOrgMemberFormProps){


  const [displayAddOrgMemberForm, setDisplayAddOrgMemberForm] = useState<boolean>(false);
  const [canidateMembers, setCanidateMembers] = useState<Member[] | []>([])

  const {enqueueSnackbar} = useSnackbar()


  const formik = useFormik({
    initialValues: { member: '' },
    validationSchema: AddMemberSchema,
    onSubmit: (data) => {
      axios.patch( `/api/org/-1`, {addMember: data.member}, )
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Ok ){
            enqueueSnackbar("Org Member Added Updated", {variant: "success"})

            setDisplayAddOrgMemberForm(false)
          }
        })
        .catch((error) => {
          formik.setSubmitting(false)
          enqueueSnackbar(error, {variant: "error"})
        })
    }
  })

  const {errors, touched, setFieldValue, initialValues,
    handleSubmit, getFieldProps, isSubmitting, isValid} = formik


  const defaultProps = {
    getOptionLabel: (option: {email: string, id: string }) => option.email,
  };

  return (
    <>
      { displayAddOrgMemberForm === false && (
        <Tooltip title="Add Member">
          <IconButton
            size="small" sx={{ ml: 1}}
            onClick={() => setDisplayAddOrgMemberForm(true) }>
            <AddMemberIcon />
          </IconButton>
        </Tooltip>
      )}
      { displayAddOrgMemberForm === true && (
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Box sx={{ ml: 1, display: 'flex'}}>
              <Autocomplete
                {...defaultProps}
                options={canidateMembers}
                size={'small'}
                sx={{ minWidth: '150px'}}
                onChange={(e, value) => {
                  setFieldValue(
                    "member",
                    value !== null ? value.id : initialValues.member
                  );
                }}

                renderInput={
                  (params) => <TextField
                    {...params} label="Add Member" error={Boolean(touched && errors.member)}
                    {...getFieldProps("member")}
                    helperText={touched && errors.member}
                  />}
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
              <Button onClick={() => setDisplayAddOrgMemberForm(false)} >Cancel</Button></Box>
            </ Box>
          </Form>
        </FormikProvider>
      )}
    </>
  )
}

