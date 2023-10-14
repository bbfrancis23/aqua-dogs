import AuthFormSchema from './AuthFormSchema'
import AuthNav from './components/AuthNav'
import {
  TextFieldProps,
  PasswordTextFieldProps,
  EmailTextField,
  PasswordTextField,
} from './components/AuthTextFields'

import AuthForm from './components/forms/AuthForm'
import ChangePasswordForm from './components/forms/ChangePasswordForm'
import RegisterForm from './components/forms/RegisterForm'
import VerifyCodeForm from './components/forms/VerifyCodeForm'

import AuthDialog from './components/dialogs/AuthDialog'
import ForgotPasswordDialog from './components/dialogs/ForgotPasswordDialog'
import RegisterDialog from './components/dialogs/RegisterDialog'

export {
  AuthFormSchema,
  AuthNav,
  EmailTextField,
  PasswordTextField,
  AuthForm,
  ChangePasswordForm,
  RegisterForm,
  VerifyCodeForm,
  AuthDialog,
  ForgotPasswordDialog,
  RegisterDialog,
}

export type {TextFieldProps, PasswordTextFieldProps}
