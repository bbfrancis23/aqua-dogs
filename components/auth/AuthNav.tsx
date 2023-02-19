
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from "@mui/material/IconButton";

import { useSession, signOut } from "next-auth/react"

import { useSnackbar } from 'notistack';

export default function AuthNav(params:any){
  
  const { setAuthDialogIsOpen} = params    
  
  const { enqueueSnackbar } = useSnackbar()
  const { data: session, status } = useSession()

  const loading = status === "loading"

  function logoutHandler(){
    signOut()
    enqueueSnackbar('You are now Logged Out', {variant: 'success'});
  }
  
  return (
    <>
      {
        session && (
          <IconButton
            color="secondary"             
            sx={{ color: 'primary.contrastText'}}
            onClick={logoutHandler}
            disabled={loading}
          >
            <LogoutIcon />
          </IconButton>  
        )
      }
      {
        !session && (
          <IconButton
            color="secondary"             
            onClick={() => setAuthDialogIsOpen(true)}            
            disabled={loading}
            sx={{ color: 'primary.contrastText'}}
          >
            <LoginIcon />
          </IconButton>  
        )
      }
    </>
  )
}