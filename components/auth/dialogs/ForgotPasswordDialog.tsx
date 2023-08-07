import React, {useState} from "react"

import {Alert, Button, DialogActions, DialogContent, Stack} from "@mui/material"
import {LoadingButton} from "@mui/lab"
import { useSnackbar } from "notistack"

import {FormikProvider, useFormik, Form} from "formik"
import axios from "axios"

import DraggableDialog from "@/ui/DraggableDialog"


import * as Yup from "yup"

import {EmailTextField} from "../AuthTextFields"

// QA: Brian Francis 08-06-23

import VerifyCodeForm from "../forms/VerifyCodeForm"


interface ForgotPasswordDialogProps {
  dialogIsOpen: boolean;
  closeDialog: () => void;
}

const ForgetPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Email must be a valid email address").required("Email is required"),
})

export default function AuthDialog(props: ForgotPasswordDialogProps) {
  const {dialogIsOpen, closeDialog} = props

  const {enqueueSnackbar} = useSnackbar()

  const [serverError, setServerError] = useState<string>("")

  const [displayVeificationCodeField, setShowVerificationCodeField] = useState<boolean>(false)
  const [email, setEmail] = useState<string | undefined>(undefined)


  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: ForgetPasswordSchema,
    onSubmit: (data) => {
      axios.post(
        "/api/auth/send-code/",
        {email: data.email},
      )
        .then((res) => {
          formik.setSubmitting(false)
          setServerError("")
          if(res.status === axios.HttpStatusCode.Ok){
            setEmail(data.email)
            setShowVerificationCodeField(true)
            enqueueSnackbar("Verification Code Sent", {variant: "success"})
          }
        })
        .catch((error) => {
          formik.setSubmitting(false)
          setServerError(error.response.data.message)

          if(error.response.status === axios.HttpStatusCode.Locked){
            closeDialog()
            formik.resetForm()
            enqueueSnackbar(error.response.data.message, {variant: "error"})
          }
        })
    },
  })

  const handleCloseDialog = () => {
    formik.resetForm()
    closeDialog()
    setServerError("")
    setShowVerificationCodeField(false)
  }

  const {errors, touched, handleSubmit, getFieldProps, isSubmitting, isValid} = formik


  return (
    <DraggableDialog
      dialogIsOpen={dialogIsOpen}
      ariaLabel="forgot-dialog"
      title="FORGOT PASSWORD"
    >
      <DialogContent>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3} sx={{width: "100%", mt: 3}}>
              { serverError && (<Alert severity="error">{serverError}</Alert>) }
              <EmailTextField
                getFieldProps={getFieldProps}
                error={errors.email}
                touched={touched.email}
              />
              <LoadingButton
                color="success"
                disabled={!(isValid && formik.dirty)}
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                { displayVeificationCodeField ? "RESEND " : "SEND "}VERIFICATION CODE
              </LoadingButton>


            </Stack>
          </Form>
        </FormikProvider>
        <Stack spacing={3} sx={{width: "100%", mt: 3}}>
          {
            displayVeificationCodeField &&
              <VerifyCodeForm closeDialog={ closeDialog} email={email}/>
          }
        </Stack>

      </DialogContent>
      <DialogActions disableSpacing={false}>
        <Button onClick={handleCloseDialog}> CANCEL </Button>

      </DialogActions>
    </DraggableDialog>
  )
}