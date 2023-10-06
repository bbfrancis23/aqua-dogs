import {useState} from "react"

import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import Head from "next/head"
import { signOut, getSession} from "next-auth/react"

import {Button, Stack, Typography, Grid, useTheme, Avatar, Box } from "@mui/material"
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
import { FxTheme } from "theme/globalTheme"
import useMemberActivity from "hooks/useMemberActivity"

/********** Interfaces Globals and Helpers **********/

interface MemberPage { member: Member, projects: Project[]}

const MemberPageTitleString = () => (
  <Typography sx={{p: 5, pl: {sm: 2, md: 0}, fontSize: {xs: '2rem', sm: '3rem'}, width: '100%' }}
    variant={'h2'} noWrap >
      Member Info
  </Typography>
)

const ChangePasswordButton = (props: {onClick: () => void}) => (
  <Button variant="outlined" sx={{ borderColor: 'divider'}} onClick={props.onClick}>
    CHANGE PASSWORD
  </Button>
)

const strGuard = (str: string | undefined) => {
  if(str) return str
  return 'Unknown Please Update'
}


const ON_UPDATE_MEMBER_MESSAGE = "Member Info Updated. Must validate credentials again"

/********** Backend **********/

export const getServerSideProps: GetServerSideProps<MemberPage> = async(context) => {

  const authSession = await getSession({req: context.req})


  const member: Member | false = await findMember(authSession?.user?.email)
  if(! member) return {redirect: {destination: "/", permanent: false}}

  const projects: Project[] = await findMemberProjects(member?.id)

  return {props: { member, projects}}
}

/********** Frontend **********/

const Page = (memberPage: InferGetServerSidePropsType<typeof getServerSideProps> ) => {

  const router = useRouter();
  const {enqueueSnackbar} = useSnackbar()

  const [projects, setProjects] = useState<Project[]>(memberPage.projects)
  const [member, setMember] = useState<Member>(memberPage.member)
  const [showPasswordForm, setShowPasswordForm] = useState<boolean>(false)
  const [showProjectForm, setShowProjectForm] = useState<boolean>(false)

  const handleLogout = async() => {
    await signOut()
    window.location.href = "/"
    enqueueSnackbar("You are now Logged Out", {variant: "success"})
  }

  const handleCloseCreateProjectForm = () => { setShowProjectForm(false) }

  const [activities, addActivity] = useMemberActivity();


  // TODO : this could be smoother - maybe better placement of the message
  const handleOnUpdateMember = () => {
    setTimeout(() => {
      enqueueSnackbar(ON_UPDATE_MEMBER_MESSAGE, {variant: "success"})
      handleLogout()
    }, 10000)
  }

  const theme: FxTheme = useTheme()

  const handleCloseChangePasswordForm = () => { setShowPasswordForm(false) }

  const MemberPageTitle = () => (
    <Stack direction={'row'}>
      {member.image && (
        <Avatar src={member.image} sx={{ height: 100, width: 100, mt: 3, mr: 3}} />
      )}
      <MemberPageTitleString />
    </ Stack>
  )

  console.log(activities)

  return (
    <>
      <Head>
        <title>{strGuard(member.name) + " - Strategy Fx - Member Page"}</title>
      </Head>
      <InfoPageLayout title={<MemberPageTitle />} >
        <Stack spacing={3} alignItems={'flex-start'} sx={{ width: '100%' }}>
          <NameForm name={strGuard(member.name)} onUpdateMember={() => handleOnUpdateMember()}/>
          <EmailForm email={strGuard(member.email)} onUpdateMember={() => handleOnUpdateMember()}/>
          <ChangePasswordButton onClick={() => setShowPasswordForm(!showPasswordForm)} />
          { showPasswordForm &&
            <ChangePasswordForm closePasswordForm={() => handleCloseChangePasswordForm()}/>
          }
          <Button sx={{ borderColor: 'divider'}} variant="outlined" onClick={handleLogout}>
            LOG OUT
          </Button>
          <Typography variant={'h4'}>Projects:</Typography>
          { showProjectForm && (
            <CreateProjectForm setProjects={(p: Project[]) => setProjects(p)}
              closeForm={handleCloseCreateProjectForm}/> ) }
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
          {
            activities.map((a) => (
              <Box key={a.id}>
                <Typography >{a.title}</Typography>
                <Typography >{a.description}</Typography>
                <Typography>{a.createdAt.toString()}</Typography>
              </ Box>
            ))
          }
          <Link href={'/privacy-policy'}
            style={{textDecoration: "none", color: theme.palette.text.primary}} >
            Privacy Policy
          </Link>
          <Link href={'/terms-of-use'}
            style={{textDecoration: "none", color: theme.palette.text.primary}} >Terms of Use</Link>
        </Stack>
      </InfoPageLayout>
    </>
  )
}

export default Page

// QA done 9-27-23