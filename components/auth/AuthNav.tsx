
import LoginIcon from '@mui/icons-material/Login';
import IconButton from "@mui/material/IconButton";
import AccountIcon from '@mui/icons-material/AccountCircle';

import { useSession } from "next-auth/react"
import Link from 'next/link'

interface AuthNavProps{
  setAuthDialogIsOpen: (authDialogIsOpen:boolean) => void
}

export default function AuthNav(params: AuthNavProps){  
  const { setAuthDialogIsOpen} = params    
  const { data: session, status } = useSession()
  const loading = status === "loading"  
  
  return (
    <>
      { session && (
        <Link href={'/member'} >
          <IconButton
            color='secondary'             
            sx={{ color: 'primary.contrastText'}}
            disabled={loading}
          >
            <AccountIcon />
          </IconButton>  
        </Link>         
      )}
      { !session && (
        <IconButton
          color='secondary'             
          onClick={() => setAuthDialogIsOpen(true)}            
          disabled={loading}
          sx={{ color: 'primary.contrastText'}}
        >
          <LoginIcon />
        </IconButton>  
      )}
    </>
  )
}