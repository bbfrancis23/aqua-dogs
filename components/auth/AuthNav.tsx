
import LoginIcon from "@mui/icons-material/Login"
import IconButton from "@mui/material/IconButton"
import AccountIcon from "@mui/icons-material/AccountCircle"

import {useSession} from "next-auth/react"
import Link from "next/link"
import { Avatar } from "@mui/material"
import { AppDialogs, DialogActions } from "@/react/app/app-types"
import { useContext } from "react"
import { AppContext } from "@/react/app"


export const AuthNav = () => {

  const {data: session, status} = useSession()
  const loading = status === "loading"


  const { dialogActions} = useContext(AppContext)

  const handleOpenAuthDialog = () => {
    dialogActions({type: DialogActions.Open, dialog: AppDialogs.Auth})
  }

  return (
    <>
      { session && (
        <Link href={"/member"} >
          <IconButton color="secondary" sx={{color: "primary.contrastText"}}
            disabled={loading} >
            { session.user?.image ? (<Avatar src={session.user.image}
              sx={{ height: 25, width: 25}} />) : ( <AccountIcon />)
            }
          </IconButton>
        </Link>
      )}
      { !session && (
        <IconButton color="secondary"
          onClick={handleOpenAuthDialog }
          disabled={loading} >
          <LoginIcon />
        </IconButton>
      )}
    </>
  )
}

export default AuthNav
// QA done 8-3-2023