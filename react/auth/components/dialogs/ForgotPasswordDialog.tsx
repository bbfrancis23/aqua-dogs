import React, {useContext, useState} from "react"
import {Alert, Button, DialogActions, DialogContent, Stack} from "@mui/material"
import {LoadingButton} from "@mui/lab"
import { useSnackbar } from "notistack"
import {FormikProvider, useFormik, Form} from "formik"
import axios from "axios"
import * as Yup from "yup"
import DraggableDialog from "@/fx/ui/DraggableDialog"
import {EmailTextField, VerifyCodeForm} from "@/react/auth"
import { AppContext, DialogActions as Actions, AppDialogs } from "@/react/app"

const Invalid = "Email must be a valid email address"
const Required = "Email is required"
const ForgetPWSchema = Yup.object().shape({ email: Yup.string().email(Invalid).required(Required)})

const AuthDialog = () => {

  const {app, dialogActions} = useContext(AppContext)
  const closeForgotPW = () => { dialogActions({type: Actions.Close, dialog: AppDialogs.Forgot}) }

  const {enqueueSnackbar} = useSnackbar()
  const [serverError, setServerError] = useState<string>("")

  const [displayVeificationCodeField, setShowVerificationCodeField] = useState<boolean>(false)
  const [email, setEmail] = useState<string | undefined>(undefined)

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: ForgetPWSchema,
    onSubmit: (data) => {
      axios.post( "/api/auth/send-code/", {email: data.email}, )
        .then((res) => {
          formik.setSubmitting(false)
          setServerError("")
          if(res.status === axios.HttpStatusCode.Ok){
            setEmail(data.email)
            setShowVerificationCodeField(true)
            enqueueSnackbar("Verification Code Sent", {variant: "success"})
          }
        }) .catch((error) => {
          formik.setSubmitting(false)
          setServerError(error.response.data.message)

          if(error.response.status === axios.HttpStatusCode.Locked){
            closeForgotPW()
            formik.resetForm()
            setServerError("")
            setShowVerificationCodeField(false)
            enqueueSnackbar(error.response.data.message, {variant: "error"})
          }
        })
    },
  })

  const endForgotPW = () => {
    formik.resetForm()
    setServerError("")
    setShowVerificationCodeField(false)
    closeForgotPW()
  }

  const {errors, dirty, touched, handleSubmit, getFieldProps, isSubmitting, isValid} = formik
  const emailTextField = {getFieldProps, error: errors.email, touched: touched.email}
  const regButton = {disabled: !(isValid && dirty), loading: isSubmitting,}

  return (
    <DraggableDialog dialogIsOpen={app.forgotDialogIsOpen}
      ariaLabel="forgot-dialog" title="FORGOT PASSWORD" >
      <DialogContent>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3} sx={{width: "100%", mt: 3}}>
              { serverError && (<Alert severity="error">{serverError}</Alert>) }
              <EmailTextField {...emailTextField} />
              <LoadingButton color="success" type="submit" {...regButton} variant="contained" >
                { displayVeificationCodeField ? "RESEND " : "SEND "}VERIFICATION CODE
              </LoadingButton>
            </Stack>
          </Form>
        </FormikProvider>
        <Stack spacing={3} sx={{width: "100%", mt: 3}}>
          { displayVeificationCodeField &&
            <VerifyCodeForm endForgotPW={ endForgotPW} email={email}/>
          }
        </Stack>
      </DialogContent>
      <DialogActions disableSpacing={false}>
        <Button onClick={endForgotPW}> CANCEL </Button>
      </DialogActions>
    </DraggableDialog>
  )
}

export default AuthDialog
// QA: Brian Francis 10-23-23