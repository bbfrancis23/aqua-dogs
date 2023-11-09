import { useContext, useEffect, useState } from "react"
import { Box, ButtonGroup, Stack, TextField, TextFieldProps } from "@mui/material"
import Button, { ButtonProps} from "@mui/material/Button"
import { useSnackbar } from "notistack"
import { Member, } from "@/react/members"
import {SectionStub, SectionTypes, commentSchema} from "@/react/section"
import axios from "axios"
import { Form, FormikProvider, useFormik } from "formik"
import {Permission, PermissionCodes, FormActions, FxCodeEditor, ClickAwaySave } from "@/fx/ui"
import { ItemContext } from "@/react/item"
import { BoardContext } from "@/react/board"
import { useSession } from "next-auth/react"

const CreateCommentForm = () => {

  const {data: session} = useSession()
  const [member, setMember] = useState<Member | undefined>(undefined)
  useEffect(() => { if(session && session.user) setMember(session.user as Member) }, [session])

  const {enqueueSnackbar} = useSnackbar()
  const {item, setItem} = useContext(ItemContext)
  const {board} = useContext(BoardContext)

  const title = "Comment"
  const {CODE, TEXT} = SectionTypes
  const [displayForm, setDisplayForm] = useState<boolean>(false)
  const [commentType, setCommentType] = useState(TEXT)

  const formik = useFormik({
    initialValues: { comment: '' },
    validationSchema: commentSchema,
    onSubmit: (data) => {
      const commentDir = `/api/members/projects/${board.project}/items/${item?.id}/comments`
      axios.post(commentDir, {content: data.comment, commenttype: commentType})
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Ok ){
            setItem(res.data.item)
            enqueueSnackbar(`${title} Created`, {variant: "success"})
            formik.resetForm()
            setDisplayForm(false)
          }
        })
        .catch((error) => {
          formik.setSubmitting(false)
          enqueueSnackbar(`Error creating ${title} ${error.message}`, {variant: "error"})
        })
    }
  })

  const {errors, touched, handleSubmit, getFieldProps} = formik

  const textButtonProps:ButtonProps = {
    variant: commentType === TEXT ? "contained" : "outlined",
    onClick: () => setCommentType(TEXT)
  }

  const codeButtonProps:ButtonProps = {
    variant: commentType === CODE ? "contained" : "outlined",
    onClick: () => setCommentType(CODE)
  }

  const textFieldProps: TextFieldProps = {
    multiline: true,
    rows: 4,
    sx: { width: '100%'},
    label: `Create ${title}`,
    ...getFieldProps('comment'),
    error: Boolean(touched && errors.comment),
    helperText: touched && errors.comment,
    autoFocus: true
  }

  return (
    <>
      {displayForm && (
        <Box sx={{ width: '100%'}}>
          <FormikProvider value={formik}>
            <ClickAwaySave>
              <Stack spacing={3}>
                <ButtonGroup>
                  <Button {...textButtonProps}>T</Button>
                  <Button {...codeButtonProps} >{"{}"}</Button>
                </ButtonGroup>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                  { commentType === TEXT && ( <TextField {...textFieldProps} /> )}
                  { commentType === CODE && (
                    <FxCodeEditor placeholder="Create Code Comment" {...getFieldProps('comment')}
                      autoFocus />
                  ) }
                  <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                    <FormActions title={'Comment'} onCancel={() => setDisplayForm(false)} />
                  </Box>
                </Form>
              </Stack>
            </ClickAwaySave>
          </FormikProvider>
        </Box>
      )
      }
      { !displayForm && (
        <>

          <Permission code={PermissionCodes.MEMBER} member={member}>
            <Box sx={{ width: '100%', cursor: 'pointer'}} onClick={() => setDisplayForm(true)} >
              <SectionStub />
            </Box>
          </Permission>
        </>
      )}
    </>
  )
}

export default CreateCommentForm
