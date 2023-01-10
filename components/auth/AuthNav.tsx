import { Fab } from "@mui/material";

import { useState, useEffect } from 'react'

import { useSession } from "next-auth/react"

import RegisterIcon from '@mui/icons-material/HowToReg';


export default function AuthNav(params:any){

  const { setAuthDialogIsOpen} = params  

  const { data: session, status } = useSession()

  const loading = status === "loading"


  
  return (
    <>
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