
import { useEffect, useState } from "react"

import { Autocomplete, Box, Button, IconButton, TextField, Tooltip } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import AddMemberIcon from '@mui/icons-material/PersonAdd';

import { useSnackbar } from "notistack"

import axios from "axios"
import {FormikProvider, useFormik, Form} from "formik"
import * as Yup from "yup"
import { Org } from "../../../interfaces/OrgInterface";
import { Member } from "../../../interfaces/MemberInterface";

const AddMemberSchema = Yup.object().shape({ member: Yup.string().required("Member is required")})

export interface AddOrgMemberFormProps {
  org: Org;
  setOrg: (org:Org) => void
}

export default function AddOrgMemberForm(props: AddOrgMemberFormProps){

  const {org, setOrg} = props

  const [displayAddOrgMemberForm, setDisplayAddOrgMemberForm] = useState<boolean>(false);
  const [canidateMembers, setCanidateMembers] = useState<Member[] | []>([])

  const {enqueueSnackbar} = useSnackbar()

  useEffect(() => {

    axios.get('/api/members').then( (res:any) => {
      let members = res.data.members.filter( (m:any) => m.id !== org.leader?.id)
      const memberIdFilter = org.members?.map( (m:any) => m.id) || []
      const adminIdFilter = org.admins?.map( (m:any) => m.id) || []
      members = members.filter((m:any) => !memberIdFilter.includes(m.id))
      members = members.filter((m:any) => !adminIdFilter.includes(m.id))

      setCanidateMembers(members)
    })
  }, [org])

  const formik = useFormik({
    initialValues: { member: '' },
    validationSchema: AddMemberSchema,
    onSubmit: (data) => {
      axios.patch( `/api/org/${org.id}`, {addMember: data.member}, )
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Ok ){
            enqueueSnackbar("Org Member Added Updated", {variant: "success"})
            setOrg(res.data.org);
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
                sx={{ width: 300 }}
                size={'small'}

                onChange={(e, value) => {
                  console.log(value);
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
              <Button onClick={() => setDisplayAddOrgMemberForm(false)} >Canel</Button></Box>
            </ Box>
          </Form>
        </FormikProvider>
      )}
    </>
  )
}

