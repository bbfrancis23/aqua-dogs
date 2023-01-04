import { useState } from "react";
import axios from "axios";
import { Box, Card, CardHeader, CardContent, Stack, Chip, Typography, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import AddItemDialog from "../../components/AddItemDialog";
import EditableItemTitle from "../../components/EditableItemTitle";
import EditableItemTags from "../../components/EditableItemTags";

export default function ItemDetails(props: any) {

  const [addItemDialogIsOpen, setAddItemDialogIsOpen] = useState(false);
  const [item, setItem] = useState(props.item)

  function handleSetItem(item: any){ 
    setItem(item)
  }
  
  const handleCloseDialog = () => {
    setAddItemDialogIsOpen(false)
  }
  
  const handleOpenDialog = () => {
    setAddItemDialogIsOpen(true)
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center'}}>
      <Card>
      <CardHeader 
          title={<EditableItemTitle item={item} setItem={ (item:any) => handleSetItem(item) } />} 
          action={<IconButton onClick={ handleOpenDialog }><AddIcon /></IconButton>}
        />
         <CardContent>
           <Stack spacing={1} direction='row'>
            <EditableItemTags item={item} setItem={ (item:any) => handleSetItem(item) } />
           </Stack>
           <Stack spacing={1} sx={{ pt: 2}}>
             { item.sections?.map( ( s:any) => (<Typography  key={s.id}>{s.content}</Typography>)) }
           </Stack>
         </CardContent>
      </Card>
      <AddItemDialog dialogIsOpen={addItemDialogIsOpen} closeDialog={handleCloseDialog}/>
    </Box>
  )
}
export async function getStaticPaths(){

   const res = await axios.get('http://localhost:5000/api/items/');
   const data = await res.data 


  const paths = data.items.map((item: any) => ({params: {itemId: item.id}}))

   return { paths, fallback: true}
   
}
export async function getStaticProps({params}: any){

  const res = await axios.get(`http://localhost:5000/api/items/${params.itemId}`);

  const data = await res.data 

  return {props: {item: data.item} }

}