import { Box } from "@mui/material";

import { useSession, signOut, getSession } from "next-auth/react"

import { useSnackbar } from 'notistack';
import Button from "@mui/material/Button";
import ChangePasswordForm from "../../components/auth/ChangePasswordForm";

export default function Profile(props: any){

  const {authSession} = props
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
    <Box sx={{ mt: 12}} >
      {
        loading && (
          <span></span>
        )
      }
      {
        (!loading && authSession) && (
          <>
           <ChangePasswordForm />
            <Button onClick={logoutHandler} variant={'outlined'}>
              LOG OUT
            </Button>
          </>           
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

  return {props: {authSession: authSession} }

}