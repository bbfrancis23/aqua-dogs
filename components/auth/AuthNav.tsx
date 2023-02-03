
import RegisterIcon from '@mui/icons-material/HowToReg';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from "@mui/material/IconButton";

import { useSession, signOut } from "next-auth/react"

import {  VariantType, useSnackbar } from 'notistack';

export default function AuthNav(params:any){
  
  const { setAuthDialogIsOpen} = params    
  
  const { enqueueSnackbar } = useSnackbar()
  const { data: session, status } = useSession()

  const loading = status === "loading"

  function logoutHandler(){
    signOut()

    const variant: VariantType = 'success'
    enqueueSnackbar('You are now Logged Out', {variant});
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
            <RegisterIcon />
          </IconButton>  
        )
      }
    </>
  )
}