import { useState } from "react";

import { Box, Card, CardContent, CardHeader, Button } from "@mui/material";
import { useSession, signOut, getSession } from "next-auth/react"

import { useSnackbar } from 'notistack';

import { getMember } from '../../mongo/controllers/memberControllers';

import ChangePasswordForm from "../../components/auth/forms/ChangePasswordForm";
import NameForm from "../../components/members/NameForm";
import EmailForm from "../../components/members/EmailForm";
import { Member } from "../../interfaces/MemberInterface";


export interface MemberProps{
  authSession: any;
  member: Member
}

export default function MemberPage(props: MemberProps){

  const {authSession, member} = props

  const [ showChangePasswordForm, setChangePasswordForm ] = useState<boolean>(false);

  const { enqueueSnackbar } = useSnackbar()
  const { status } = useSession()

  const loading = status === "loading"
  
  if(!loading && !authSession){
    window.location.href = '/'
  }


  async function  logoutHandler(){
    await signOut()
    window.location.href = '/'
    enqueueSnackbar('You are now Logged Out', {variant: 'success'});
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 12}}>
      {  loading && <span>Loading</span> }
      {!loading && authSession && (
          <Card sx={{ width: {xs: '100vw', md: '50vw' } }}>
          <CardHeader title='Member Information' />
          <CardContent sx={{pl: 3}}>
          <NameForm name={member?.name ? member.name : ''} />  
          <EmailForm email={member?.email ? member.email : ''} />  
          <Box><Button onClick={() => setChangePasswordForm(!showChangePasswordForm)} >Change Password</Button></Box>
          { showChangePasswordForm &&  <ChangePasswordForm />}
          <Box><Button onClick={logoutHandler} >LOG OUT</Button></Box>
          </CardContent>           
          </Card>           
        )
      }     
    </Box>
  )
}

export async function getServerSideProps(context: any){
  const authSession = await getSession({req: context.req})

  if(!authSession){
    return { redirect:{ destination: '/', permanent: false }}
  }

  let member: Member

  if(authSession.user && authSession.user.email){
    const result = await getMember(authSession.user.email);
    if(result.member){
      member = {
        email: result.member.email,
        name: result.member.name,
        roles: result.member.roles,
        id: result.member.id
      }      

    }else{
      return { redirect:{ destination: '/', permanent: false }}
    }
  }else{
    return { redirect:{ destination: '/', permanent: false }}
  }  

  return {props: {authSession: authSession, member} }
}