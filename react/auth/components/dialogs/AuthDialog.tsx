import { useContext } from "react"
import { AppContext } from "@/react/app"
import AuthForm from "../forms/AuthForm"
import DraggableDialog from "@/fx/ui/DraggableDialog"

export default function AuthDialog() {

  const {app} = useContext(AppContext)

  return (
    <DraggableDialog dialogIsOpen={app.authDialogIsOpen} ariaLabel="auth-dialog" title="LOGIN" >
      <AuthForm />
    </DraggableDialog>
  )
}

// QA: Brian Francis 10-23-23