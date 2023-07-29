import {useState} from "react"

import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { signOut, getSession} from "next-auth/react"

import {Button, Stack, Typography, Grid } from "@mui/material"
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

export type MemberPage = {
  member: Member
  projects: Project[]
}

export const getServerSideProps: GetServerSideProps<MemberPage> = async(context) => {

  const authSession = await getSession({req: context.req})
  const member: Member | false = await getValidMember(authSession)

  if(! member) return {redirect: {destination: "/", permanent: false}}

  let projects: Project[] = await getMemberProjects(member?.id)
  return {props: { member, projects}}
}

const Page = (memberPage: InferGetServerSidePropsType<typeof getServerSideProps> ) => {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>(memberPage.projects)
  const [member, setMember] = useState<Member>(memberPage.member)

  const [showChangePasswordForm, setShowChangePasswordForm] = useState<boolean>(false)
  const [showProjectForm, setShowProjectForm] = useState<boolean>(false)
  const {enqueueSnackbar} = useSnackbar()

  // TODO: add loading logout
  const handleLogout = async() => {
    await signOut()
    window.location.href = "/"
    enqueueSnackbar("You are now Logged Out", {variant: "success"})
  }

  const handleCloseCreateProjectForm = () => { setShowProjectForm(false) }

  return (
    <InfoPageLayout title="Member Info">
      <Stack spacing={3} alignItems={'flex-start'} sx={{ width: '100%', }}>
        <NameForm name={member?.name ? member.name : ""} />
        <EmailForm email={member?.email ? member.email : ""} />
        <Button variant="outlined" color="inherit" sx={{ borderColor: 'divider'}}
          onClick={() => setShowChangePasswordForm(!showChangePasswordForm)} >
          CHANGE PASSWORD
        </Button>
        { showChangePasswordForm && <ChangePasswordForm />}
        <Button sx={{ borderColor: 'divider'}} variant="outlined" color="inherit"
          onClick={handleLogout}>
            LOG OUT
        </Button>
        <Typography variant={'h4'}>Projects:</Typography>
        { showProjectForm && (
          <CreateProjectForm setProjects={(p: Project[]) => setProjects(p)}
            closeForm={handleCloseCreateProjectForm}/>
        ) }
        <Grid container spacing={1} sx={{pr: 3 }}>
          { projects.map( (p: Project) => (
            <Grid item xs={6} sm={3} md={2} key={p.id}>
              <Button sx={{ m: 0, p: 0, width: '100%'}}
                onClick={() => router.push(`/member/projects/${p.id}`)} >
                <ProjectStub project={p} />
              </Button>
            </Grid>
          )) }
          <Grid item xs={6} sm={3} md={2} >
            <Button onClick={() => setShowProjectForm(true)} sx={{ m: 0, p: 0, width: '100%'}}>
              <ProjectStub />
            </Button>
          </Grid>
        </Grid>
      </Stack>
    </InfoPageLayout>
  )
}

export default Page

