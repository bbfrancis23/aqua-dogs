import {useState} from "react"

import { GetServerSideProps } from "next"
import { signOut, getSession} from "next-auth/react"

import {CardContent,
  CardHeader, Button, Stack, Typography, Card, Skeleton, Box, Tooltip, Grid } from "@mui/material"
import {useSnackbar} from "notistack"

import {Member, getValidMember} from "../../interfaces/MemberInterface"
import ChangePasswordForm from "../../components/auth/forms/ChangePasswordForm"
import NameForm from "../../components/members/NameForm"
import EmailForm from "../../components/members/EmailForm"

import InfoCardContainer from "../../ui/information-card/InfoCardContainer"
import InfoCard from "../../ui/information-card/InfoCard"
import CreateProjectForm from "../../components/members/projects/forms/CreateProjectForm"
import ProjectStub from "../../components/members/projects/ProjectStub"
import { Project } from "../../interfaces/ProjectInterface"
import { getMemberProjects } from "../../mongo/controllers/memberControllers"
import { useRouter } from "next/router"

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
    <InfoCardContainer >

      <InfoCard>
        <CardHeader title={ 'Member Information:' } />
        <CardContent sx={{pl: 3}}>
          <Stack spacing={3} alignItems={'flex-start'}>
            <NameForm name={member?.name ? member.name : ""} />
            <EmailForm email={member?.email ? member.email : ""} />
            <Button sx={{ color: 'text.primary'}}
              onClick={() => setShowChangePasswordForm(!showChangePasswordForm)} >
                Change Password
            </Button>
            { showChangePasswordForm && <ChangePasswordForm />}
            <Button sx={{ color: 'text.primary'}} onClick={logoutHandler}>LOG OUT</Button>
            <Typography variant={'h5'}>Projects:</Typography>
            { showProjectForm && (
              <CreateProjectForm setProjects={(p:any) => setProjects(p)}
                closeForm={() => handleCloseCreateProjectForm()}/>
            ) }
            <Grid container spacing={1}>

              {
                projects.map( (p) => (
                  <Grid item xs={3} key={p.id}>
                    <Button
                      onClick={() => router.push(`/member/projects/${p.id}`)} sx={{ m: 0, p: 0}}>

                      <ProjectStub project={p} />
                    </Button>
                  </Grid>
                ))
              }
              <Grid item xs={3} >
                <Tooltip title="Create Project">

                  <Button onClick={() => setShowProjectForm(true)} sx={{ m: 0, p: 0}}>
                    <ProjectStub />
                  </Button>
                </Tooltip>
              </Grid>
            </Grid>

          </Stack>

        </CardContent>
      </InfoCard>
    </InfoCardContainer>
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


