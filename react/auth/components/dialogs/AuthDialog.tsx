
import DraggableDialog from "@/ui/DraggableDialog"


import AuthForm from "../forms/AuthForm"
import { useContext } from "react"
import { AppContext } from "@/react/app"


export default function AuthDialog() {

  const {app, dialogActions} = useContext(AppContext)

  return (
    <DraggableDialog dialogIsOpen={app.authDialogIsOpen} ariaLabel="auth-dialog" title="LOGIN" >
      <AuthForm />
    </DraggableDialog>
  )
}

// QA: Brian Francis 08-04-23