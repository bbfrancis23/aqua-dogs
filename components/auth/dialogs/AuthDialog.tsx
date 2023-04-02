
import DraggableDialog from "../../../ui/DraggableDialog"
import AuthForm from "../forms/AuthForm"

interface AuthDialogProps {
  dialogIsOpen: boolean;
  closeDialog: () => void;
  openRegDialog: () => void;
  openForgotDialog: () => void;
}

export default function AuthDialog(props: AuthDialogProps) {
  const {dialogIsOpen, closeDialog, openRegDialog, openForgotDialog} = props

  return (
    <DraggableDialog
      dialogIsOpen={dialogIsOpen}
      ariaLabel="auth-dialog"
      title="LOGIN"
    >
      <AuthForm
        openRegisterDialog={openRegDialog}
        closeDialog={closeDialog}
        openForgotDialog={openForgotDialog}
      />
    </DraggableDialog>
  )
}