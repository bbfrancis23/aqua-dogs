import { LoadingButton, LoadingButtonProps } from "@mui/lab"
import { SxProps, Theme } from "@mui/material/styles"
import { useFormikContext } from "formik"


export interface SaveButtonProps {
  sx?: SxProps<Theme>
  variant?: 'text' | 'outlined' | 'contained'
  children: React.ReactNode
}

const SaveButton = ({ sx, children, variant}: SaveButtonProps) => {

  const {isValid, dirty, isSubmitting} = useFormikContext()

  const saveButton: LoadingButtonProps = {
    color: 'success',
    disabled: !(isValid && dirty),
    type: 'submit',
    loading: isSubmitting,
    variant,
    sx
  }

  return (
    <LoadingButton {...saveButton} >
      {children}
    </LoadingButton>
  )
}

export default SaveButton

// QA Brian Francis 10-26-23