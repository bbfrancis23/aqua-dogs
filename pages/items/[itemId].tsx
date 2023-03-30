import { useEffect, useMemo, useState } from "react";

import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";

import { 
  Box, Card, CardHeader, CardContent, Stack,  Typography, IconButton, Chip, CardActions
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import { useSnackbar } from 'notistack';
import "@uiw/react-textarea-code-editor/dist.css";

import ItemFormDialog from "../../components/items/ItemFormDialog";
import EditableItemTitle from "../../components/EditableItemTitle";
import ItemRating from "../../components/items/ItemRating";
import { Item } from '../../interfaces/Item';
import { getItems, getItem } from '../../mongo/controllers/item';
import Permission from "../../ui/Permission";
import PermissionCodes from "../../enums/PermissionCodes";


const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  { ssr: false }
)

export interface ItemDetailsProps{
  item: Item;
  errors: string[];
  openAuthDialog: () => void
}

const ItemDetails = (props: ItemDetailsProps) => {

  const {openAuthDialog, errors} = props;

  const { enqueueSnackbar } = useSnackbar()
  
  useEffect( 
    () =>  errors.forEach( e => enqueueSnackbar(`Error: ${e}`, {variant: 'error'})), 
    [errors, enqueueSnackbar]
  )

  const [addItemDialogIsOpen, setAddItemDialogIsOpen] = useState<boolean>(false)
  const [itemDialogMode, setItemDialogMode] = useState('ADD')


  const [item, setItem] = useState(props.item)
  const { data: session, status } = useSession()

  useMemo(() => { setItem(item) },[item])

  function handleSetItem(item: any){ 
    setItem(item)
  }
  
  const handleCloseDialog = () => {
    setItemDialogMode('ADD')
    setAddItemDialogIsOpen(false)
  }
  
  const handleOpenDialog = (mode: string) => {
    setItemDialogMode(mode)
    setAddItemDialogIsOpen(true)
  } 

  return (
   
    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 12}}>
      <Card sx={{ width: {xs: '100vw', md: '50vw' } }}>
        <CardHeader 
          title={<EditableItemTitle item={item} setItem={ (item:any) => handleSetItem(item) } />} 
          action={
            <Permission roles={[PermissionCodes.SITEADMIN]}>
               <IconButton onClick={() =>  handleOpenDialog('EDIT') }><EditIcon /></IconButton>
              <IconButton onClick={() => handleOpenDialog('ADD') }><AddIcon /></IconButton>
            </Permission>           
          }
        />
        <CardContent>
          <Stack spacing={1} direction='row'>
            { item.tags && (
             

                item.tags.map( (t:any) => {
                  return ( <Chip label={t.title} variant="outlined" key={t.id} /> )
                })
            )}
           </Stack>
           <Stack spacing={1} sx={{ pt: 2}}>
            { 
              item.sections?.map( ( s:any) => {

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
                        "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace"
                    }}
                  />
                  )

                }else{
                  return (<Typography  key={s.id}>{s.content}</Typography>) 
                }
              })
                
            }
          </Stack>
          
        </CardContent>
        <CardActions>
          <ItemRating item={item}  openAuthDialog={openAuthDialog}/>
          
        </CardActions>
      </Card>
     
      <ItemFormDialog mode={itemDialogMode} dialogIsOpen={addItemDialogIsOpen} closeDialog={handleCloseDialog} editItem={item} updateEditedItem={(item:any) => handleSetItem(item)} />
    </Box>
  )
}
export default ItemDetails
export async function getStaticPaths(){

  let items 
  try { items = await getItems()} 
  catch (e) { console.log(e) }

  let paths

  if(items){
    paths = items.map((item: any) => ({params: {itemId: item.id}}))
  } 

  return { paths, fallback: 'blocking'}
   
}
export const getStaticProps= async ({params}:any) => {

  let item 
  let errors = []

  try { 
    item = await getItem(params.itemId)
  } 
  catch (e) { errors.push(e) }

  return {
      props: {
      item: item ? item : null,
      errors
    }
  }

}