import { useState} from "react"

import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Head from "next/head"
import { signOut, getSession} from "next-auth/react"

import {Button, Stack} from "@mui/material"
import {useSnackbar} from "notistack"

import { findMember, findMemberProjects } from "@/mongo/controls/member/memberControls"

import {Member, NameForm, EmailForm, MemberPageHeader, MemberContext} from "@/react/members"
import {ChangePasswordForm} from "@/react/auth/"
import { Project, Projects } from "@/react/project/"

import { InfoPageLayout } from "@/fx/ui"

import { strGuard } from "@/error"

interface MemberPage { member: Member, projects: Project[]}

const ChangePasswordButton = (props: {onClick: () => void}) => (
  <Button variant="outlined" sx={{ borderColor: 'divider'}} onClick={props.onClick}>
    CHANGE PASSWORD
  </Button>
)

const ON_UPDATE_MEMBER_MESSAGE = "Member Info Updated. Must validate credentials again"

export const getServerSideProps: GetServerSideProps<MemberPage> = async(context) => {

  const authSession = await getSession({req: context.req})

  const member: Member | false = await findMember(authSession?.user?.email)
  if(! member) return {redirect: {destination: "/", permanent: false}}

  const projects: Project[] = await findMemberProjects(member?.id)

  return {props: { member, projects}}
}

const Page = (memberPage: InferGetServerSidePropsType<typeof getServerSideProps> ) => {

  const {enqueueSnackbar} = useSnackbar()

  const [member, setMember] = useState<Member>(memberPage.member)
  const [showPasswordForm, setShowPasswordForm] = useState<boolean>(false)

  const handleLogout = async() => {
    await signOut()
    window.location.href = "/"
    enqueueSnackbar("You are now Logged Out", {variant: "success"})
  }

  // TODO : this could be smoother - maybe better placement of the message
  const handleOnUpdateMember = () => {
    setTimeout(() => {
      enqueueSnackbar(ON_UPDATE_MEMBER_MESSAGE, {variant: "success"})
      handleLogout()
    }, 10000)
  }

  const handleCloseChangePasswordForm = () => { setShowPasswordForm(false) }

  return (
    <>
      <MemberContext.Provider value={{member, setMember}}>
        <Head>
          <title>{strGuard(member.name) + " - Strategy Fx - Member Page"}</title>
        </Head>
        <InfoPageLayout title={<MemberPageHeader />} >
          <Stack spacing={3} alignItems={'flex-start'} sx={{ width: '100%' }}>
            <NameForm name={strGuard(member.name)} onUpdateMember={() => handleOnUpdateMember()}/>
            <EmailForm email={member.email} onUpdateMember={() => handleOnUpdateMember()}/>
            <ChangePasswordButton onClick={() => setShowPasswordForm(!showPasswordForm)} />
            { showPasswordForm &&
            <ChangePasswordForm closePasswordForm={() => handleCloseChangePasswordForm()}/>
            }
            <Button sx={{ borderColor: 'divider'}} variant="outlined" onClick={handleLogout}>
            LOG OUT
            </Button>
            <Projects projects={memberPage.projects} />
          </Stack>
        </InfoPageLayout>
      </MemberContext.Provider>
    </>
  )
}

export default Page

// QA done 9-27-23