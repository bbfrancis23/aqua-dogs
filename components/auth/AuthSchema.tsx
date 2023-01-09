import * as Yup from 'yup'

const passwordMinLength = 6

const AuthSchema = Yup.object().shape({
  email: Yup.string().email('Email must be a valid email address').required('Email is required'),
  password:
    Yup.string().min(passwordMinLength, `Password must be at least ${passwordMinLength} characters`)
      .required('Password is required'),
})

export default AuthSchema