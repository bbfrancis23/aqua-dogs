
import { ProjectContext } from "@/react/project/"
import { useContext } from "react"
import { Box, Button, TextField, TextFieldProps } from "@mui/material"
import { useSnackbar } from "notistack"
import { Form, FormikProvider, useFormik } from "formik"
import DoneIcon from '@mui/icons-material/Done'
import CloseIcon from '@mui/icons-material/Close'
import * as Yup from "yup"
import axios from "axios"
import { ItemContext } from "@/react/item/ItemContext"
import { SaveButton } from "@/fx/ui"
import { BoardContext } from "@/react/board"

export interface EditItemTitleFormProps{ closeForm: () => void}

const editItemSchema = Yup.object().shape({ title: Yup.string().required('Title is required')})

const EditTitleItemForm = ({closeForm}: EditItemTitleFormProps) => {
  const {board, setBoard} = useContext(BoardContext)
  const {project} = useContext(ProjectContext)
  const {item, setItem} = useContext(ItemContext)
  const {enqueueSnackbar} = useSnackbar()

  const formik = useFormik({
    initialValues: { title: item?.title },
    validationSchema: editItemSchema,
    onSubmit: (data) => {
      const itemDir = `/api/members/projects/${project?.id}/items/${item?.id}`
      axios.patch( itemDir, {title: data.title},
      )
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Ok ){
            setItem(res.data.item)
            axios.get(`/api/members/projects/${project?.id}/boards/${board?.id}`).then((res) => {
              if (res.status === axios.HttpStatusCode.Ok){
                setBoard(res.data.board)
              }
            })
            enqueueSnackbar("Item title updated", {variant: "success"})
            formik.resetForm()
            closeForm()
          }
        })
        .catch((error) => {
          formik.setSubmitting(false)
          enqueueSnackbar(error.message, {variant: "error"})
        })
    }
  })

  const endForm = () => { formik.resetForm(); closeForm() }

  const {errors, touched, handleSubmit, getFieldProps, } = formik

  const textFieldProps: TextFieldProps = {
    size: 'medium',
    label: 'Card Title',
    variant: 'outlined',
    sx: { '& .MuiOutlinedInput-root': { fontSize: '3rem' }},
    error: Boolean(touched && errors.title),
    helperText: touched && errors.title,
    ...getFieldProps('title'),
    autoFocus: true,
  }

  return (
    <Box>
      <Box sx={{ p: 5, pl: 2}}>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <TextField {...textFieldProps} />
            <Box display={{ display: 'flex', justifyContent: "right" }}>
              <SaveButton sx={{minWidth: '0'}} ><DoneIcon /></SaveButton>
              <Button onClick={() => endForm()} ><CloseIcon color={'error'}/></Button>
            </Box>
          </Form>
        </FormikProvider>
      </Box>
    </Box>
  )
}

export default EditTitleItemForm

// QA Brian Francis 11-23-23