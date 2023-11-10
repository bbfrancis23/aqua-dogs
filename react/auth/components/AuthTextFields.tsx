import {useState} from "react"

import {IconButton, InputAdornment, TextField} from "@mui/material"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"

import { FieldInputProps } from "formik"

export interface TextFieldProps {
  getFieldProps: (nameOrOptions: any) => FieldInputProps<any>
  touched: boolean | undefined
  error: string | undefined
  autoFocus?: boolean
}

export interface PasswordTextFieldProps extends TextFieldProps {
  label?: string
  fieldId?: string
}

export const EmailTextField = ({getFieldProps, touched, error, autoFocus}: TextFieldProps) => (
  <TextField
    fullWidth
    size="small"
    type="email"
    label="Email address"
    {...getFieldProps("email")}
    autoFocus={autoFocus}
    error={Boolean(touched && error)}
    helperText={touched && error} />
)

export const PasswordTextField = (props: PasswordTextFieldProps) => {
  const {getFieldProps, touched, error, autoFocus} = props
  let {label, fieldId} = props

  label = label ? label : "Password"
  fieldId = fieldId ? fieldId : "password"

  const [showPassword, setShowPassword] = useState(false)

  return (
    <TextField
      fullWidth
      autoFocus={autoFocus}
      size="small"
      autoComplete="current-password"
      type={showPassword ? "text" : "password"}
      label={label} {...getFieldProps(fieldId)}
      InputProps={{ endAdornment: (
        <InputAdornment position="end">
          <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
            { showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
        </InputAdornment>),}}
      error={Boolean(touched && error)}
      helperText={touched && error} />
  )
}


// QA: Brian Francis 10-26-23