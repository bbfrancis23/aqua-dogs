import React, { useContext } from "react"
import RegisterForm from "../forms/RegisterForm"
import DraggableDialog from "@/fx/ui/DraggableDialog"
import { AppContext, DialogActions, AppDialogs } from "@/react/app"

export default function RegisterDialog() {

  const {app, dialogActions} = useContext(AppContext)
  const closeDialog = () => dialogActions({type: DialogActions.Close, dialog: AppDialogs.Reg})
  const openAuthDialog = () => dialogActions({type: DialogActions.Open, dialog: AppDialogs.Auth})

  return (
    <DraggableDialog dialogIsOpen={app.regDialogIsOpen}
      ariaLabel="register-dialog" title="REGISTER" >
      <RegisterForm />
    </DraggableDialog>
  )
}

// QA: Brian Francis 10-23-23