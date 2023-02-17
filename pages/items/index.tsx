import { useState } from 'react';

import { Box, IconButton, Toolbar, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid'
import { useConfirm } from "material-ui-confirm";
import { useSnackbar } from 'notistack';

import { useSession} from "next-auth/react";

import axios from 'axios';

const columns = [
  { field: 'id', headerName: 'ID', width: 300},
  { field: 'title', headerName: "Title", width: 500},
  { field: 'tags', headerName: 'Tags', width: 1000}
]


export default function Items(props: any) {

  let {items} = props
  
  const { data: session, status } = useSession()
  const confirm = useConfirm()
  const { enqueueSnackbar } = useSnackbar()

  const [selectedRows, setSelectedRows] = useState([])
  
  const itemsToRows = () => {
    return  items.map( (i:any) => {
      return {
        id: i._id,
        title: i.title,
        tags: i.tags.map( (t:any) => t.title).join(", ")
      }
    } )
  }
  
  const [rows, setRows] = useState( itemsToRows())

  

  const handleDelete = async () => {

    for (const selectedRow of selectedRows){

      await confirm({description: `delete ${selectedRow}`})
      .then( () => {
        axios.delete(`http://localhost:3000/api/items/${selectedRow}`).then( r => {
          if(r.data.message === 'success'){
            items = items.filter( (item:any) => item.id !== selectedRow)  
            setRows(itemsToRows())            
            enqueueSnackbar(`Deleted ${selectedRow}`, {variant: 'success'})               
          }
        })
      })
    }   
  }

  const handleSelectionChange = (ids: any) =>     setSelectedRows(ids)
  return (
    <> 
     {
        (!session ) && 
        ( <Typography sx={{mt: 12}}>Permission Denied</Typography> )
      }
      {
        session && (
          <Box style={{ height: '100vh', width: '100%' }} sx={{ mt: 12}}>
          <Toolbar>
            <IconButton onClick={handleDelete}>          
              <DeleteIcon />
            </IconButton>
          </Toolbar>
          <DataGrid 
            rows={rows}
            columns={columns}
            pageSize={100}
            rowsPerPageOptions={[100]}
            checkboxSelection
            onSelectionModelChange={(ids) => handleSelectionChange(ids)}
          />
        </Box>
        )
      }   
    </>   
  );

}
export async function getStaticProps() {
  let items;
  try {   

    const fullStackRes = await axios.get('http://localhost:3000/api/items/')
    items = fullStackRes.data


  } catch (err) {
    console.log(err);
  }

  return {
    props: {
      items: items.data,
    },
  };
}
