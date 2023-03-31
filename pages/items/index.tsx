import { useEffect, useState } from 'react';

import { Box, IconButton, Toolbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridSelectionModel } from '@mui/x-data-grid'
import { useConfirm } from "material-ui-confirm";
import { useSnackbar } from 'notistack';

import axios, { HttpStatusCode } from 'axios';

import { Item } from '../../interfaces/ItemInterface';
import { getItems } from '../../mongo/controllers/itemControllers';
import Permission from '../../ui/Permission';
import PermissionCodes from '../../enums/PermissionCodes';

const columns = [
  { field: 'id', headerName: 'ID', width: 300},
  { field: 'title', headerName: "Title", width: 500},
  { field: 'tags', headerName: 'Tags', width: 1000}
]

export interface ItemsProps{ 
  items: Item[],
  errors: string[] 
}

const Items = (props: ItemsProps) => {

  let {items, errors} = props  

  const confirm = useConfirm()
  const { enqueueSnackbar } = useSnackbar()

  const [ selectedRows, setSelectedRows ] = useState<GridSelectionModel>([])

  useEffect( 
    () =>  errors.forEach( e => enqueueSnackbar(`Error: ${e}`, {variant: 'error'})), 
    [ errors, enqueueSnackbar ]
  )
  
  const itemsToRows = () => {
    return  items.map( (i:any) => {
      return {
        id: i.id,
        title: i.title,
        tags: i.tags.map( (t:any) => t.title).join(", ")
      }
    } )
  }
  
  const [ rows, setRows ] = useState( itemsToRows())   

  const handleDelete = async () => {

    try{
      for (const selectedRow of selectedRows){
        await confirm({description: `delete ${selectedRow}`})
        .then( () => {
          axios.delete(`/api/items/${selectedRow}`)
          .then( (r) => {
            if(r.status === HttpStatusCode.Ok){
              items = items.filter( (item:any) => item.id !== selectedRow)  
              setRows(itemsToRows())            
              enqueueSnackbar(`Deleted ${selectedRow}`, {variant: 'success'})               
            }else{enqueueSnackbar(`Unknown Error`, {variant: 'error'}) }
          })
          .catch((e) =>   enqueueSnackbar(`Error Deleting ${e}`, {variant: 'error'}) )
        })
      } 
    }catch(e){enqueueSnackbar(`Error Deleting ${e}`, {variant: 'error'}) }        
  }

  const handleSelectionChange = (ids: GridSelectionModel) => setSelectedRows(ids)
  
  return (
    <Box style={{ height: '100vh', width: '100%' }} sx={{ mt: 12}}>
      <Toolbar>       
        <Permission roles={[ PermissionCodes.SITEADMIN ]}>
          <IconButton onClick={handleDelete}><DeleteIcon /></IconButton>
        </Permission>
      </Toolbar>
      <DataGrid 
        rows={rows}
        columns={columns}
        pageSize={100}
        rowsPerPageOptions={[ 100 ]}
        checkboxSelection
        onSelectionModelChange={(ids) => handleSelectionChange(ids)}
      />
    </Box>
  )
}
export default Items
export const getStaticProps = async() => {  

  let items 
  let errors = []
  try { items = await getItems()} 
  catch (e) { errors.push(e) }

  return {
    props: {
      items: items ? items : [],
      errors
    },
  }
}
