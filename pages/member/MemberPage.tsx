import {useState} from "react"

import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { signOut, getSession} from "next-auth/react"
import { useRouter } from "next/router"

import {Button, Stack, Typography, Grid } from "@mui/material"
import {useSnackbar} from "notistack"

import { Project } from "@/interfaces/ProjectInterface"
import {Member} from "@/interfaces/MemberInterface"

import { findMember, findMemberProjects } from "@/mongo/controls/member/memberControls"

import ChangePasswordForm from "@/components/auth/forms/ChangePasswordForm"
import NameForm from "@/components/members/NameForm"
import EmailForm from "@/components/members/EmailForm"
import ProjectStub from "@/components/members/projects/ProjectStub"
import InfoPageLayout from "@/ui/InfoPageLayout"
import CreateProjectForm from "@/components/members/projects/forms/CreateProjectForm"


export type MemberPage = {
  member: Member
  projects: Project[]
}

export const getServerSideProps: GetServerSideProps<MemberPage> = async(context) => {

  const authSession = await getSession({req: context.req})
  const member: Member | false = await findMember(authSession?.user?.email)

  if(! member) return {redirect: {destination: "/", permanent: false}}

  const projects: Project[] = await findMemberProjects(member?.id)

  return {props: { member, projects}}
}

const Page = (memberPage: InferGetServerSidePropsType<typeof getServerSideProps> ) => {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>(memberPage.projects)
  const [member, setMember] = useState<Member>(memberPage.member)

  const [showChangePasswordForm, setShowChangePasswordForm] = useState<boolean>(false)
  const [showProjectForm, setShowProjectForm] = useState<boolean>(false)
  const {enqueueSnackbar} = useSnackbar()

  const handleLogout = async() => {
    await signOut()
    window.location.href = "/"
    enqueueSnackbar("You are now Logged Out", {variant: "success"})
  }

  const handleCloseCreateProjectForm = () => { setShowProjectForm(false) }

  const handleOnUpdateMember = () => {
    handleLogout()
  }

  const handleCloseChangePasswordForm = () => { setShowChangePasswordForm(false) }

  return (
    <InfoPageLayout title="Member Info">
      <Stack spacing={3} alignItems={'flex-start'} sx={{ width: '100%', }}>
        <NameForm name={member?.name ? member.name : ""}
          onUpdateMember={() => handleOnUpdateMember()}/>
        <EmailForm email={member?.email ? member.email : ""}
          onUpdateMember={() => handleOnUpdateMember()}/>
        <Button variant="outlined" color="inherit" sx={{ borderColor: 'divider'}}
          onClick={() => setShowChangePasswordForm(!showChangePasswordForm)} >
          CHANGE PASSWORD
        </Button>
        { showChangePasswordForm &&
          <ChangePasswordForm closePasswordForm={() => handleCloseChangePasswordForm()}/>
        }
        <Button sx={{ borderColor: 'divider'}} variant="outlined" color="inherit"
          onClick={handleLogout}>
            LOG OUT
        </Button>
        <Typography variant={'h4'}>Projects:</Typography>
        { showProjectForm && (
          <CreateProjectForm setProjects={(p: Project[]) => setProjects(p)}
            closeForm={handleCloseCreateProjectForm}/>
        ) }
        <Grid container spacing={0} sx={{pr: 3 }}>
          { projects.map( (p: Project) => (
            <Grid item xs={6} sm={3} md={2} key={p.id} sx={{p: 1}}>
              <Button sx={{ m: 0, p: 0, width: '100%'}}
                onClick={() => router.push(`/member/projects/${p.id}`)} >
                <ProjectStub project={p} />
              </Button>
            </Grid>
          )
          ) }
          <Grid item xs={6} sm={3} md={2} sx={{p: 1}}>
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

// QA done 8-8-23