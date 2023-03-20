
import React from 'react'
import { TextField } from '@mui/material'

export default function EmailTextField(props: any) {
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