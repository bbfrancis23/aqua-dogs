import * as Yup from 'yup'
export const passwordMinLength = 6

export const PasswordSchema = Yup.string()
  .min(passwordMinLength, `Password must be at least ${passwordMinLength} characters`)
  .required('Password is required')

export const EmailSchema = Yup.string()
  .email('Email must be a valid email address')
  .required('Email is required')

const AuthFormSchema = Yup.object().shape({
  email: EmailSchema,
  password: PasswordSchema,
})

export default AuthFormSchema

// QA: Brian Francis 10-26-23
