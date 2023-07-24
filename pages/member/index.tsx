import {useState} from "react"

import { GetServerSideProps } from "next"
import { signOut, getSession} from "next-auth/react"

import {Button, Stack, Typography, Tooltip, Grid } from "@mui/material"
import {useSnackbar} from "notistack"

import {Member, getValidMember} from "../../interfaces/MemberInterface"
import ChangePasswordForm from "../../components/auth/forms/ChangePasswordForm"
import NameForm from "../../components/members/NameForm"
import EmailForm from "../../components/members/EmailForm"
import CreateProjectForm from "../../components/members/projects/forms/CreateProjectForm"
import ProjectStub from "../../components/members/projects/ProjectStub"
import { Project } from "../../interfaces/ProjectInterface"
import { getMemberProjects } from "../../mongo/controllers/memberControllers"
import { useRouter } from "next/router"
import InfoPageLayout from "@/ui/info-page-layout/InfoPageLayout"

export interface MemberPageProps{ member: Member; projects: Project[]}

export default function MemberPage(props: MemberPageProps){
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>(props.projects)
  const [member, setMember] = useState<Member>(props.member)

  const [showChangePasswordForm, setShowChangePasswordForm] = useState<boolean>(false)
  const [showProjectForm, setShowProjectForm] = useState<boolean>(false)
  const {enqueueSnackbar} = useSnackbar()

  const logoutHandler = async() => {
    await signOut()
    window.location.href = "/"
    enqueueSnackbar("You are now Logged Out", {variant: "success"})
  }

  const handleCloseCreateProjectForm = () => {
    setShowProjectForm(false)
  }

  return (
    <InfoPageLayout title="Member Info">
      <Stack spacing={3} alignItems={'flex-start'} sx={{ width: '100%'}}>
        <NameForm name={member?.name ? member.name : ""} />
        <EmailForm email={member?.email ? member.email : ""} />
        <Button variant="outlined" color="inherit"
          onClick={() => setShowChangePasswordForm(!showChangePasswordForm)} >
                       Change Password
        </Button>
        { showChangePasswordForm && <ChangePasswordForm />}
        <Button
          variant="outlined" color="inherit" onClick={logoutHandler}>LOG OUT</Button>
        <Typography variant={'h5'}>Projects:</Typography>
        { showProjectForm && (
          <CreateProjectForm setProjects={(p:any) => setProjects(p)}
            closeForm={() => handleCloseCreateProjectForm()}/>
        ) }
        <Grid container spacing={1} >
          { projects.map( (p) => (

            <Grid item xs={6} sm={3} md={2} key={p.id}>
              <Button
                onClick={() => router.push(`/member/projects/${p.id}`)} sx={{ m: 0, p: 0}}>

                <ProjectStub project={p} />
              </Button>
            </Grid>
          )) }
          <Grid item xs={3} >
            <Tooltip title="Create Project">
              <Button onClick={() => setShowProjectForm(true)} sx={{ m: 0, p: 0}}>
                <ProjectStub />
              </Button>
            </Tooltip>
          </Grid>
        </Grid>

      </Stack>
    </InfoPageLayout>
  )
}

export const getServerSideProps: GetServerSideProps<MemberPageProps> = async(context) => {

  const authSession = await getSession({req: context.req})
  const member: Member | false = await getValidMember(authSession)

  if(member){
    let projects: Project[] | [] = await getMemberProjects(member?.id)
    return {props: { member, projects}}
  }
  return {redirect: {destination: "/", permanent: false}}
}


