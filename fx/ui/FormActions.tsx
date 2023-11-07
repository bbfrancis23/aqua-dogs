import { LoadingButton, LoadingButtonProps } from "@mui/lab"
import { useFormikContext } from "formik"
import { Button, ClickAwayListener, Stack, SxProps } from "@mui/material"
import { ConfirmOptions, useConfirm } from "material-ui-confirm"
import { useSnackbar } from "notistack"

export interface FormActionsProps {
  onCancel: () => void,
  onDelete?: () => void,
  title: string,
  sx?: SxProps
}

export interface ClickAwayProps {
  children: JSX.Element
}

export const ClickAwaySave = ({children}: ClickAwayProps) => {
  const {isValid, dirty, handleSubmit} = useFormikContext()
  const disabled = !(isValid && dirty)

  const checkForSave = (e: MouseEvent | TouchEvent ) => {

    if (e.target) {
      const target = e.target as HTMLElement
      if (target.id === 'cancel-button' || target.id === 'confirm-button') return
    }
    if(disabled) return
    handleSubmit()
  }

  return (
    <ClickAwayListener mouseEvent="onMouseDown"
      onClickAway={(e: MouseEvent | TouchEvent) => checkForSave(e)} >
      {children}
    </ClickAwayListener>
  )
}

const FormActions = ({title, onCancel, onDelete, sx}: FormActionsProps) => {

  const confirm = useConfirm()
  const {enqueueSnackbar} = useSnackbar()

  const confirmOptions: ConfirmOptions = {
    description: `Delete ${title}`,
    cancellationButtonProps: {id: 'cancel-button'},
    dialogProps: {PaperProps: {sx: {maxWidth: '400px'}}},
    confirmationButtonProps: {id: 'confirm-button'}
  }

  const confirmDelete = async () => {
    if(!onDelete) return
    await confirm( confirmOptions)
      .then(() => { onDelete() })
      .catch((error) => {
        const message = error.response.data.message
        enqueueSnackbar(`Error Deleting ${title}: ${message}`, {variant: "error"})
      })
      .catch((e) => enqueueSnackbar(`Delete ${title} aborted`, {variant: "error"}) )
  }

  const {isValid, dirty, isSubmitting} = useFormikContext()
  const disabled = !(isValid && dirty)

  const saveButtonProps: LoadingButtonProps = {
    color: "success",
    disabled,
    type: "submit",
    loading: isSubmitting,
    variant: "contained"
  }

  const deleteButtonProps: LoadingButtonProps = {
    loading: isSubmitting,
    onClick: () => confirmDelete(),
    variant: disabled ? 'contained' : 'outlined',
    color: "error",
    id: "az-delete-button"
  }

  return (

    <Stack direction={'row'} spacing={1} sx={{p: 1, pr: 0, ...sx}}>
      <LoadingButton {...saveButtonProps}>save</LoadingButton>
      { onDelete && <LoadingButton {...deleteButtonProps} >Delete</LoadingButton> }
      <Button onClick={() => onCancel()} sx={{ color: 'text.primary'}} variant="outlined">
        Cancel
      </Button>
    </Stack>

  )
}

export default FormActions

// QA Brian Francis 11-07-23