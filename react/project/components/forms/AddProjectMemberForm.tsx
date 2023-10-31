
import { useEffect, useState, useContext } from "react"
import { Autocomplete, Box, Button, TextField, TextFieldProps} from "@mui/material"
import CloseIcon from '@mui/icons-material/Close'
import SaveIcon from '@mui/icons-material/Done'
import { useSnackbar } from "notistack"
import axios from "axios"
import {FormikProvider, useFormik, Form} from "formik"
import * as Yup from "yup"
import { ProjectContext } from "@/react/project"
import { Member, MemberStub } from "@/react/members"
import { SaveButton } from "@/fx/ui"

const AddMemberSchema = Yup.object().shape({ member: Yup.string().required("Member is required")})

const AddProjectMemberForm = () => {

  const {enqueueSnackbar} = useSnackbar()

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
            setProject(res.data.project)
            setShowForm(false)
          }
        })
        .catch((error) => {
          formik.setSubmitting(false)
          enqueueSnackbar(error, {variant: "error"})
        })
    }
  })

  const {errors, touched, setFieldValue, initialValues, handleSubmit, getFieldProps} = formik

  const defaultProps = { getOptionLabel: (option: {email: string, id: string }) => option.email }

  const textFieldProps: TextFieldProps = {
    label: "Add Member",
    ...getFieldProps("member"),
    error: Boolean(touched && errors.member),
    helperText: touched && errors.member
  }

  return (
    <>
      { showForm === false && (
        <MemberStub setShowForm={setShowForm}/>
      )}
      { showForm === true && (
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Box sx={{ ml: 1, display: 'flex', mt: 3}}>
              <Autocomplete
                {...defaultProps}
                options={canidateMembers}
                size={'small'}
                fullWidth
                sx={{ minWidth: '300px'}}
                onChange={(e, value) => {
                  const v = value !== null ? value.id : initialValues.member
                  setFieldValue( "member", value !== null ? value.id : initialValues.member )
                }}
                renderInput={ (params) => <TextField {...params} {...textFieldProps} />}
              />
            </ Box>
            <Box display={{ display: 'flex', justifyContent: "right" }}>
              <SaveButton sx={{minWidth: '0'}} ><SaveIcon /></SaveButton>
              <Button onClick={() => setShowForm(false)} sx={{ minWidth: '0'}}>
                <CloseIcon color={'error'}/>
              </Button>
            </Box>
          </Form>
        </FormikProvider>
      )}
    </>
  )
}

export default AddProjectMemberForm
// QA: Brian Franci 10-30-23