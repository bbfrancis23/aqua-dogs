import { Box, Card, CardContent, CardHeader } from "@mui/material";

import { useSession, signOut, getSession } from "next-auth/react"

import { useSnackbar } from 'notistack';
import Button from "@mui/material/Button";
import ChangePasswordForm from "../../components/auth/ChangePasswordForm";
import { useState } from "react";
import NameForm from "../../components/members/NameForm";


import { getMember } from '../../lib/controlers/member';
import EmailForm from "../../components/members/EmailForm";

export interface MemberProps{

}

export default function Member(props: any){

  const {authSession, member} = props

  const [showChangePasswordForm, setChangePasswordForm] = useState(false);

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
      {
        loading && (
          <span>Loading</span>
        )
      }
      {
        (!loading && authSession) && (
          <Card sx={{ width: {xs: '100vw', md: '50vw' } }}>

          <CardHeader title="Member Information" />
          <CardContent sx={{pl: 3}}>
          <NameForm name={member?.name ? member.name : undefined} />  
          <EmailForm email={member?.email ? member.email : undefined} />  
          <Box><Button onClick={() => setChangePasswordForm(!showChangePasswordForm)} >Change Password</Button></Box>
          { showChangePasswordForm &&            <ChangePasswordForm />}
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


  console.log(authSession)

  if(!authSession){
    return { redirect:{ destination: '/', permanent: false }}
  }

  let member

  if(authSession.user && authSession.user.email){
    const result = await getMember(authSession.user.email);
    if(result.member){
      member = result.member;
    }else{
      return { redirect:{ destination: '/', permanent: false }}
    }
  }else{
    return { redirect:{ destination: '/', permanent: false }}
  }  

  return {props: {authSession: authSession, member} }
}