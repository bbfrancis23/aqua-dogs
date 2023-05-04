import {useEffect, useMemo, useState} from "react"
import dynamic from "next/dynamic"

import {
  Box, Card, CardHeader, CardContent, Stack, Typography, IconButton, Chip, CardActions
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"

import {useSnackbar} from "notistack"
import "@uiw/react-textarea-code-editor/dist.css"

import ItemFormDialog from "../../components/items/ItemFormDialog"
import EditableItemTitle from "../../components/EditableItemTitle"
import ItemRating from "../../components/items/ItemRating"
import {Item} from "../../interfaces/ItemInterface"
import {getItems, getItem} from "../../mongo/controllers/itemControllers"
import Permission from "../../ui/Permission"
import PermissionCodes from "../../enums/PermissionCodes"
import ItemFavorite from "../../components/items/ItemFavorite"
import FormModes from "../../enums/FormModes"


const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  {ssr: false}
)

export interface ItemDetailsProps{
  item: Item;
  errors: string[];
  openAuthDialog: () => void
}

const ItemDetails = (props: ItemDetailsProps) => {

  const {openAuthDialog, errors} = props
  const {enqueueSnackbar} = useSnackbar()

  useEffect(
    () => errors.forEach( (e:any) => enqueueSnackbar(
      `Error: ${e}`, {variant: "error"}
    )),
    [errors, enqueueSnackbar]
  )

  const [addItemDialogIsOpen, setAddItemDialogIsOpen] = useState<boolean>(false)
  const [itemDialogMode, setItemDialogMode] = useState<FormModes>(FormModes.ADD)

  const [item, setItem] = useState(props.item)

  useMemo(
    () => { setItem(item) }, [item]
  )

  const handleCloseDialog = () => {
    setItemDialogMode(FormModes.ADD)
    setAddItemDialogIsOpen(false)
  }

  const handleOpenDialog = (mode: FormModes) => {
    setItemDialogMode(mode)
    setAddItemDialogIsOpen(true)
  }

  return (

    <Box sx={{display: "flex", justifyContent: "center", pt: 12}}>
      <Card sx={{width: {xs: "100vw", md: "50vw"}}}>
        <CardHeader
          title={<EditableItemTitle item={item} setItem={ (i:any) => setItem(i) } />}
          action={
            <Permission roles={[PermissionCodes.SITE_ADMIN]}>
              <IconButton onClick={() => handleOpenDialog(FormModes.EDIT) }>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleOpenDialog(FormModes.ADD) }><AddIcon /></IconButton>
            </Permission> }
        />
        <CardContent>
          <Stack spacing={1} direction="row">
            { item.tags && (
              item.tags.map( (t:any) => ( <Chip label={t.title} variant="outlined" key={t.id} /> ))
            )}
          </Stack>
          <Stack spacing={1} sx={{pt: 2}}>
            { item.sections?.map( ( s:any) => {

              if(s.sectiontype === "63b88d18379a4f30bab59bad"){

                return (
                  <CodeEditor
                    key={s.id}
                    value={s.content}
                    language="jsx"
                    readOnly
                    padding={15}
                    style={{
                      fontSize: 12,
                      backgroundColor: "#f5f5f5",
                      fontFamily:
                        "ui-monospace,SF Mono,Consolas,Liberation Mono,Menlo,monospace"
                    }}
                  />
                )

              }
              return (<Typography key={s.id}>{s.content}</Typography>)

            })}
          </Stack>

        </CardContent>
        <CardActions>
          <ItemRating item={item} openAuthDialog={openAuthDialog}/>
          <ItemFavorite item={item} openAuthDialog={openAuthDialog} />
        </CardActions>
      </Card>

      <ItemFormDialog
        mode={itemDialogMode}
        dialogIsOpen={addItemDialogIsOpen}
        closeDialog={handleCloseDialog}
        editItem={item} updateEditedItem={(i:any) => setItem(i)} />
    </Box>
  )
}
export default ItemDetails
export const getStaticPaths = async() => {

  let items:any = [{}]
  try { items = await getItems() } catch (e) { console.log(e) }

  let paths = [{}]

  if(items){
    paths = items.map((item: any) => ({params: {itemId: item.id}}))
  }

  return {paths, fallback: "blocking"}

}
export const getStaticProps = async ({params}:any) => {

  let item: any = null
  const errors = []

  try {
    item = await getItem(params.itemId)
  } catch (e) { errors.push(e) }

  return {
    props: {
      item: item ? item : null,
      errors
    }
  }

}