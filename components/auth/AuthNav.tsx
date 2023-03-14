
import LoginIcon from '@mui/icons-material/Login';
import IconButton from "@mui/material/IconButton";

import { useSession } from "next-auth/react"

import { useSnackbar } from 'notistack';
import AccountIcon from '@mui/icons-material/AccountCircle';

import Link from 'next/link'

export default function AuthNav(params:any){
  
  const { setAuthDialogIsOpen} = params    
  
  const { enqueueSnackbar } = useSnackbar()
  const { data: session, status } = useSession()

  const loading = status === "loading"

  
  
  return (
    <>
      {
        session && (
          <Link href={'/member'} >
            <IconButton
              color="secondary"             
              sx={{ color: 'primary.contrastText'}}
              disabled={loading}
            >
              <AccountIcon />
            </IconButton>  
          </Link>
         
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