import { Fab } from "@mui/material";

import { useState, useEffect } from 'react'

import { useSession, signOut } from "next-auth/react"

import RegisterIcon from '@mui/icons-material/HowToReg';
import LogoutIcon from '@mui/icons-material/Logout';


export default function AuthNav(params:any){

  const { setAuthDialogIsOpen} = params  

  const { data: session, status } = useSession()

  const loading = status === "loading"

  function logoutHandler(){
    signOut()
  }

  
  return (
    <>
      {
        session && (
          <Fab
          color="secondary"             
          
        >
          <LogoutIcon onClick={logoutHandler}/>
        </Fab>  
        )
      }
      {
        !session && (
          <Fab
            color="secondary"             
            onClick={() => setAuthDialogIsOpen(true)}
          >
            <RegisterIcon />
          </Fab>  
        )
      }
    </>
  )
}