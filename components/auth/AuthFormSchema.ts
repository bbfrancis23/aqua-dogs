import * as Yup from "yup"

export const passwordMinLength = 6

export const passwordSchema = Yup.string()
  .min(passwordMinLength, `Password must be at least ${passwordMinLength} characters`)
  .required("Password is required")

export const emailSchema = Yup.string()
  .email("Email must be a valid email address").required("Email is required")

const AuthFormSchema = Yup.object().shape({
  email: emailSchema,
  password: passwordSchema
})

export default AuthFormSchema