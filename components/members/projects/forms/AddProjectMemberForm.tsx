
import { useEffect, useState, useContext } from "react"

import { Autocomplete, Avatar, Box, Button, Card, CardHeader, Skeleton, TextField,
  Typography, useTheme } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import AddMemberIcon from '@mui/icons-material/PersonAdd';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Done';
import { useSnackbar } from "notistack"

import axios from "axios"
import {FormikProvider, useFormik, Form} from "formik"
import * as Yup from "yup"

import { ProjectContext } from "@/react/project/project-types";
import { Member } from "@/react/member/member-types";

const AddMemberSchema = Yup.object().shape({ member: Yup.string().required("Member is required")})


const AddProjectMemberForm = () => {

  const theme = useTheme()
  const {enqueueSnackbar} = useSnackbar()

  const [animation, setAnimation] = useState<false | 'wave'| 'pulse'>(false)

  const getBgColor = () => {
    if(theme.palette.mode === 'light'){ return 'grey.300' }
    return 'grey.400'
  }

  const {project, setProject} = useContext(ProjectContext)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [canidateMembers, setCanidateMembers] = useState<Member[] | []>([])


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
      axios.patch( `/api/members/projects/${project.id}`, {addMember: data.member}, )
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
        <Card onClick={() => setShowForm(true) }
          onMouseEnter={() => setAnimation('pulse')} onMouseLeave={() => setAnimation(false)}>
          <CardHeader
            action={ <Skeleton variant="circular" animation={animation}
              sx={{ height: '25px', width: '25px' }}>
              <AddMemberIcon />
            </Skeleton> }
            title={ <Skeleton animation={animation} >
              <Typography variant={'body1'}>Project Member Name</Typography>
            </Skeleton> }
            subheader={ <Skeleton animation={animation} >
              <Typography variant={'body1'}>member.email@gmail.com</Typography>
            </Skeleton>}
            avatar={ <Skeleton variant="circular" animation={animation} >
              <Avatar sx={{ bgcolor: getBgColor(), width: 50, height: 50}} >
                <AddMemberIcon />
              </Avatar>
            </Skeleton>
            } />
        </Card>
      )}
      { showForm === true && (
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Box sx={{ ml: 1, display: 'flex', mt: 3}}>
              <Autocomplete {...defaultProps} options={canidateMembers} size={'small'} fullWidth
                sx={{ minWidth: '300px'}}
                onChange={(e, value) => {
                  const v = value !== null ? value.id : initialValues.member
                  setFieldValue( "member", value !== null ? value.id : initialValues.member );
                }}
                renderInput={ (params) =>
                  <TextField {...params} label="Add Member" {...getFieldProps("member")}
                    error={Boolean(touched && errors.member)}
                    helperText={touched && errors.member} />} />
            </ Box>
            <Box display={{ display: 'flex', justifyContent: "right" }}>
              <LoadingButton color="success" disabled={!(isValid && formik.dirty)}
                type="submit" loading={isSubmitting} sx={{minWidth: '0'}} >
                <SaveIcon />
              </LoadingButton>
              <Button onClick={() => setShowForm(false)} sx={{ minWidth: '0'}}>
                <CloseIcon color={'error'}/></Button>
            </Box>
          </Form>
        </FormikProvider>
      )}
    </>
  )
}

export default AddProjectMemberForm
// QA: Brian Francis 8-10-23