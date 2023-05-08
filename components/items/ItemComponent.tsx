import { Box, Card, CardActions, CardContent, CardHeader, Chip, IconButton, Stack,
  Typography } from "@mui/material"
import Permission from "../../ui/Permission"

import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import PermissionCodes from "../../enums/PermissionCodes"
import ItemRating from "./ItemRating"
import ItemFavorite from "./ItemFavorite"
import ItemFormDialog from "./ItemFormDialog"


import EditableItemTitle from "../../components/EditableItemTitle"

import dynamic from "next/dynamic"


import "@uiw/react-textarea-code-editor/dist.css"
import { Item } from "../../interfaces/ItemInterface"
import { useMemo, useState } from "react"
import FormModes from "../../enums/FormModes"

const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  {ssr: false}
)

export interface ItemComponentProps{
  item: Item;
  openAuthDialog: () => void
}

const ItemComponent = (props: ItemComponentProps) => {

  const { openAuthDialog} = props

  const [item, setItem] = useState(props.item)

  const [itemDialogMode, setItemDialogMode] = useState<FormModes>(FormModes.ADD)
  const [addItemDialogIsOpen, setAddItemDialogIsOpen] = useState<boolean>(false)

  const handleOpenDialog = (mode: FormModes) => {
    setItemDialogMode(mode)
    setAddItemDialogIsOpen(true)
  }


  useMemo(
    () => { setItem(item) }, [item]
  )

  const handleCloseDialog = () => {
    setItemDialogMode(FormModes.ADD)
    setAddItemDialogIsOpen(false)
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
    </Box>)
}
export default ItemComponent;
