import {useState} from "react"
import Link from "next/link"
import {useSession, signOut, getSession} from "next-auth/react"

import {Box, Card, CardContent, CardHeader, Button, Typography, Stack,
  Skeleton, useTheme} from "@mui/material"

import {useSnackbar} from "notistack"

import {getMember, getMemberOrgs} from "../../mongo/controllers/memberControllers"

import {Member} from "../../interfaces/MemberInterface"
import { Tag } from "../../interfaces/TagInterface"

import OrgForm from "../../components/org/forms/OrgForm"
import ChangePasswordForm from "../../components/auth/forms/ChangePasswordForm"
import NameForm from "../../components/members/NameForm"
import EmailForm from "../../components/members/EmailForm"
import AddMemberTagForm from "../../components/org/forms/AddMemberTagForm"
import MemberTag from "../../components/members/MemberTag"
import InfoCardContainer from "../../ui/information-card/InfoCardContainer"
import InfoCard from "../../ui/information-card/InfoCard"

export interface MemberProps{ authSession: any; member: Member; orgs: any;}

export default function MemberPage(props: MemberProps){

  const {authSession, member, orgs} = props

  const [showChangePasswordForm, setShowChangePasswordForm] = useState<boolean>(false)
  const [showOrgForm, setShowOrgForm] = useState<boolean>(false)

  const {enqueueSnackbar} = useSnackbar()

  const {status} = useSession()

  const loading = status === "loading"

  if(!loading && !authSession){ window.location.href = "/" }

  const logoutHandler = async() => {
    await signOut()
    window.location.href = "/"
    enqueueSnackbar("You are now Logged Out", {variant: "success"})
  }

  return (
    <InfoCardContainer >
      {authSession && (
        <InfoCard>
          <CardHeader title={ 'Member Information' } variant={'info'} />
          <CardContent sx={{pl: 3}}>
            <Stack spacing={3} alignItems={'flex-start'}>
              <NameForm name={member?.name ? member.name : ""} />
              <EmailForm email={member?.email ? member.email : ""} />
              <Button sx={{ color: 'text.primary'}}
                onClick={() => setShowChangePasswordForm(!showChangePasswordForm)}
              >
                Change Password
              </Button>
              { showChangePasswordForm && <ChangePasswordForm />}

              <Box sx={{ display: 'flex', pb: 1}}>
                <Typography variant={'h6'} >Tags:</Typography>
                <AddMemberTagForm />
                <Box >
                  { member.tags?.map( (t:Tag) => (
                    <Link key={t.id}
                      href={`/member/tags/${t.id}`}
                    >
                      <MemberTag tag={t} />
                    </Link>
                  ))}
                </Box>
              </Box>

              <Typography variant={'h6'}>My Organizations:</Typography>
              {
                orgs.map( (o:any) => (
                  <Box key={o.id}>
                    <Link
                      href={`/member/orgs/${o.id}`}

                    >
                      <Button >
                        {o.title}
                      </Button>
                    </Link>

                  </Box>
                ))
              }
              <Typography variant={'h6'}>Actions:</Typography>


              <Button variant="contained"
                onClick={() => setShowOrgForm(!showOrgForm)}
              >
                Found organization
              </Button>
              { showOrgForm && <OrgForm />}

              <Button sx={{ color: 'text.primary'}} onClick={logoutHandler}>LOG OUT</Button>
            </Stack>

          </CardContent>
        </InfoCard>
      )
      }
    </InfoCardContainer>
  )
}

export const getServerSideProps = async(context: any) => {
  const authSession = await getSession({req: context.req})

  if(!authSession){
    return {redirect: {destination: "/", permanent: false}}
  }

  let member: any = {}

  if(authSession.user && authSession.user.email){
    const result = await getMember(authSession.user.email)


    if(result.member){
      member = {
        email: result.member.email,
        name: result.member.name ? result.member.name : '',
        roles: result.member.roles,
        tags: result.member.tags,
        id: result.member.id
      }

    }else{
      return {redirect: {destination: "/", permanent: false}}
    }
  }else{
    return {redirect: {destination: "/", permanent: false}}
  }

  let orgs:any = await getMemberOrgs(member.id)
  orgs = orgs.map( (o:any) => ({ id: o._id.toString(), title: o.title}))


  return {props: {authSession, member, orgs}}
}