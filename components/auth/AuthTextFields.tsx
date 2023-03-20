import { useState } from 'react'

import { IconButton, InputAdornment, TextField } from '@mui/material'

import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

export function EmailTextField(props: any) {
  const { getFieldProps, touched, error } = props

  return (
    <TextField
      fullWidth
      size="small"
      type="email"
      label="Email address"
      {...getFieldProps('email')}
      error={Boolean(touched && error)}
      helperText={touched && error}
    />
  )
}

export function PasswordTextField(props: any) {
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