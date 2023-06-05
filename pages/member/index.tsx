import {useState} from "react"

import { GetServerSideProps } from "next"
import Link from "next/link"
import { signOut, getSession} from "next-auth/react"

import {Box, CardContent, CardHeader, Button, Typography, Stack } from "@mui/material"
import {useSnackbar} from "notistack"

import { getMemberOrgs} from "../../mongo/controllers/memberControllers"

import {Member, getValidMember} from "../../interfaces/MemberInterface"
import { Tag } from "../../interfaces/TagInterface"
import { Org } from "../../interfaces/OrgInterface"

import OrgForm from "../../components/org/forms/OrgForm"
import ChangePasswordForm from "../../components/auth/forms/ChangePasswordForm"
import NameForm from "../../components/members/NameForm"
import EmailForm from "../../components/members/EmailForm"
import AddMemberTagForm from "../../components/org/forms/AddMemberTagForm"
import MemberTag from "../../components/members/MemberTag"

import InfoCardContainer from "../../ui/information-card/InfoCardContainer"
import InfoCard from "../../ui/information-card/InfoCard"

export interface MemberPageProps{ member: Member; orgs: Org[] | []}

export default function MemberPage(props: MemberPageProps){

  const {orgs} = props

  const [member, setMember] = useState<Member>(props.member)

  const [showChangePasswordForm, setShowChangePasswordForm] = useState<boolean>(false)
  const [showOrgForm, setShowOrgForm] = useState<boolean>(false)
  const {enqueueSnackbar} = useSnackbar()

  const logoutHandler = async() => {
    await signOut()
    window.location.href = "/"
    enqueueSnackbar("You are now Logged Out", {variant: "success"})
  }


  return (
    <InfoCardContainer >

      <InfoCard>
        <CardHeader title={ 'Member Information:' } variant={'info'} />
        <CardContent sx={{pl: 3}}>
          <Stack spacing={3} alignItems={'flex-start'}>
            <NameForm name={member?.name ? member.name : ""} />
            <EmailForm email={member?.email ? member.email : ""} />
            <Button sx={{ color: 'text.primary'}}
              onClick={() => setShowChangePasswordForm(!showChangePasswordForm)} >
                Change Password
            </Button>
            { showChangePasswordForm && <ChangePasswordForm />}
            <Box sx={{ display: 'flex', pb: 1}}>
              <Typography variant={'h6'} >My Tags:</Typography>
              <AddMemberTagForm setMember={(m:any) => setMember(m)}/>
            </Box>

            <Box >
              { member.tags?.map( (t:Tag) => (
                <MemberTag tag={t} key={t.id} />
              ))}
            </Box>

            <Typography variant={'h6'}>My Organizations:</Typography>
            {
              orgs.map( (o:Org) => (
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
    </InfoCardContainer>
  )
}


export const getServerSideProps: GetServerSideProps<MemberPageProps> = async(context) => {

  const authSession = await getSession({req: context.req})
  const member: Member | false = await getValidMember(authSession)

  if(member){
    let orgs: Org[] | [] = await getMemberOrgs(member?.id)
    return {props: { member, orgs}}
  }

  return {redirect: {destination: "/", permanent: false}}

}


