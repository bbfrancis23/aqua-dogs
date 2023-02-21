import React, { useState } from 'react'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

export default function PasswordTextField(props: any) {
  const { getFieldProps, touched, error, } = props

  let {label, fieldId} = props

  label = label ? label : 'Password'
  fieldId = fieldId ? fieldId : 'password'

  const [showPassword, setShowPassword] = useState(false)

  return (
    <TextField
      fullWidth
      size="small"
      autoComplete="current-password"
      type={showPassword ? 'text' : 'password'}
      label={label}
      {...getFieldProps(fieldId)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
              { showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      error={Boolean(touched && error)}
      helperText={touched && error}
    />
  )
}