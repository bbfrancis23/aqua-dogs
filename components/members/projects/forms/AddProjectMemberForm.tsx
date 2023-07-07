
import { useEffect, useState, useContext } from "react"

import { Autocomplete,
  Avatar,
  Box,
  Button, ListItem,
  ListItemAvatar, ListItemButton, ListItemText,
  Skeleton, TextField, Tooltip, useTheme } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import AddMemberIcon from '@mui/icons-material/PersonAdd';

import { useSnackbar } from "notistack"

import axios from "axios"
import {FormikProvider, useFormik, Form} from "formik"
import * as Yup from "yup"
import { Member } from "../../../../interfaces/MemberInterface";
import { ProjectContext } from "pages/member/projects/[projectId]";

const AddMemberSchema = Yup.object().shape({ member: Yup.string().required("Member is required")})

/* eslint-disable */

export interface AddProjectMemberFormProps {
}

const AddProjectMemberForm = (props: AddProjectMemberFormProps) => {


  const theme = useTheme()

  const getBgColor = () => {
    if(theme.palette.mode === 'light'){
      return 'grey.300'
    }
      return 'grey.400'
    

  }


  const {project, setProject} = useContext(ProjectContext)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [canidateMembers, setCanidateMembers] = useState<Member[] | []>([])

  const {enqueueSnackbar} = useSnackbar()

  useEffect(() => {

    axios.get('/api/members').then( (res:any) => {
      let members = res.data.members.filter( (m:any) => m.id !== project.leader?.id)

      const memberIdFilter = project.members?.map( (m:any) => m.id) || []
      const adminIdFilter = project.admins?.map( (m:any) => m.id) || []
      members = members.filter((m:any) => !memberIdFilter.includes(m.id))
      members = members.filter((m:any) => !adminIdFilter.includes(m.id))

      setCanidateMembers(members)
    })
  }, [project])

  const formik = useFormik({
    initialValues: { member: '' },
    validationSchema: AddMemberSchema,
    onSubmit: (data) => {
      axios.patch( `/api/projects/${project.id}`, {addMember: data.member}, )
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Ok ){
            enqueueSnackbar("Project Member Added Updated", {variant: "success"})
            setProject(res.data.project);
            setShowForm(false)
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
      { showForm === false && (
       
       

        <Tooltip title="Add Member">

        <ListItemButton alignItems="flex-start" onClick={() => setShowForm(true) }> 
       

          <ListItemAvatar  >   
           
             <Avatar sx={{ bgcolor: getBgColor(), width: 50, height: 50}} >
              <AddMemberIcon />
            </Avatar>
                 
           
          </ListItemAvatar>
          <ListItemText
            primary={ <Skeleton animation={false} />}
            secondary={<Skeleton animation={false} />}
            />
        
        </ListItemButton> 
      </Tooltip>
      )}
      { showForm === true && (
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Box sx={{ ml: 1, display: 'flex',  mt: 3}}>
              <Autocomplete
                {...defaultProps}
                options={canidateMembers}
                size={'small'}
                sx={{ minWidth: '300px'}}
                onChange={(e, value) => {

                  const v = value !== null ? value.id : initialValues.member

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
              <Button onClick={() => setShowForm(false)} >Cancel</Button></Box>
            </ Box>
          </Form>
        </FormikProvider>
      )}
    </>
  )
}

export default AddProjectMemberForm