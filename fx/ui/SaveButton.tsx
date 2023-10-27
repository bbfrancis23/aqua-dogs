import { LoadingButton, LoadingButtonProps } from "@mui/lab"
import { SxProps, Theme } from "@mui/material/styles"
import { useFormikContext } from "formik"


export interface SaveButtonProps {
  sx?: SxProps<Theme>
  children: React.ReactNode
}

const SaveButton = ({ sx, children}: SaveButtonProps) => {

  const {isValid, dirty, isSubmitting} = useFormikContext()

  const saveButton: LoadingButtonProps = {
    color: 'success',
    disabled: !(isValid && dirty),
    type: 'submit',
    loading: isSubmitting,
    sx
  }

  return (
    <LoadingButton {...saveButton} >
      {children}
    </LoadingButton>
  )
}

export default SaveButton