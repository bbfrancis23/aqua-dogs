import { useMemo, useState } from "react";

import { Box, Card, CardHeader, CardContent, Stack,  Typography, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';


import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";

import axios from "axios";

import ItemFormDialog from "../../components/ItemFormDialog";
import EditableItemTitle from "../../components/EditableItemTitle";
import EditableItemTags from "../../components/EditableItemTags";


import "@uiw/react-textarea-code-editor/dist.css";
const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  { ssr: false }
)

export default function ItemDetails(props: any) {

  const [addItemDialogIsOpen, setAddItemDialogIsOpen] = useState(false)
  const [itemDialogMode, setItemDialogMode] = useState('ADD')

  const [item, setItem] = useState(props.item)
  const { data: session, status } = useSession()

  useMemo(() => {

    
      setItem(item)
    

  },[item])

  function handleSetItem(item: any){ 

    console.log('the item has changed');
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
            (session) && 
            <>
              <IconButton onClick={() =>  handleOpenDialog('EDIT') }><EditIcon /></IconButton>
              <IconButton onClick={() => handleOpenDialog('ADD') }><AddIcon /></IconButton>
            </>
          }
        />
         <CardContent>
           <Stack spacing={1} direction='row'>
            <EditableItemTags item={item} setItem={ (item:any) => handleSetItem(item) } />
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
      </Card>
     
      <ItemFormDialog mode={itemDialogMode} dialogIsOpen={addItemDialogIsOpen} closeDialog={handleCloseDialog} editItem={item} updateEditedItem={(item:any) => handleSetItem(item)} />
    </Box>
  )
}
export async function getStaticPaths(){

 
    const res = await axios.get('http://localhost:5000/api/items/');
    const data = await res.data 

  


  const paths = data.items.map((item: any) => ({params: {itemId: item.id}}))

   return { paths, fallback: 'blocking'}
   
}
export async function getStaticProps({params}: any){

  const res = await axios.get(`http://localhost:5000/api/items/${params.itemId}`);

  const data = await res.data 

  return {props: {item: data.item} }

}