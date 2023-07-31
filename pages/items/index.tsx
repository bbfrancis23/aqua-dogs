import {useEffect, useState} from "react"

import {Box, IconButton} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import {useConfirm} from "material-ui-confirm"
import {useSnackbar} from "notistack"

import axios, {HttpStatusCode} from "axios"

import {Item} from "../../interfaces/ItemInterface"
import {getItems} from "../../mongo/controllers/itemControllers"
import Permission from "../../ui/old-Permission"
import PermissionCodes from "../../enums/PermissionCodes"

import Link from "next/link"
import { DataGrid, GridColDef, GridFooter, GridRenderCellParams,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector, } from "@mui/x-data-grid";


const RenderLink = (props: GridRenderCellParams) => (
  <Link href={`/items/${props.id}`} >{props.row.title}</Link>
)

const columns: GridColDef[] = [
  {field: "title", headerName: "Title", minWidth: 200, renderCell: RenderLink},
  {field: "tags", headerName: "Tags", minWidth: 300},
  {field: "rating", headerName: "Rating", minWidth: 10},
]

export interface ItemsProps{
  items: Item[],
  errors: string[]
}

const Items = (props: ItemsProps) => {

  let {items} = props
  const {errors} = props
  const confirm = useConfirm()
  const {enqueueSnackbar} = useSnackbar()

  const [selectedRows, setSelectedRows] = useState<any>([])

  useEffect(
    () => errors.forEach( (e:any) => enqueueSnackbar(`Error: ${e}`, {variant: "error"})),
    [errors, enqueueSnackbar]
  )

  const itemsToRows = () => items.map( (i:any) => ({
    id: i.id,
    title: i.title,
    tags: i.tags.map( (t:any) => t.title).join(", "),
    rating: i.rating
  }))

  const [rows, setRows] = useState( itemsToRows())

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
                  enqueueSnackbar(`Deleted ${selectedRow}`, {variant: "success"})
                } else{ enqueueSnackbar("Unknown Error", {variant: "error"}) }
              })
              .catch((e) => enqueueSnackbar(`Error Deleting ${e}`, {variant: "error"}) )
          })
      }
    } catch(e){ enqueueSnackbar(`Error Deleting ${e}`, {variant: "error"}) }
  }

  const handleSelectionChange = (ids: SelectionMode) => setSelectedRows(ids)

  const CustomToolbar = () => (
    <Box style={{ width: "100%"}} sx={{mt: 12}}>
      <GridToolbarContainer sx={{ pl: 1.75}}>
        {
          selectedRows.length > 0 &&
        <Box >
          <Permission roles={[PermissionCodes.SITE_ADMIN]}>
            <IconButton onClick={handleDelete} size="small"><DeleteIcon /></IconButton> |
          </Permission>
        </Box>
        }
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </GridToolbarContainer>
    </Box>
  )

  return (
    <>

      <div style={{height: "900px", width: "100%"}} >
        <DataGrid
          slots={{
            toolbar: CustomToolbar,
            footer: GridFooter
          }}
          rows={rows}
          columns={columns}
          checkboxSelection
          onRowSelectionModelChange={(ids:any) => handleSelectionChange(ids)}
        />
      </div>
    </>
  )
}
export default Items
export const getStaticProps = async() => {

  let items:any = [{}]
  const errors = []
  try { items = await getItems() } catch (e) { errors.push(e) }

  if(items){
    items = items.map((i:any) => {

      const upvotes = i?.upvotes?.length ? i?.upvotes?.length : 0
      const downvotes = i?.downvotes?.length ? i?.downvotes?.length : 0
      i.rating = upvotes - downvotes

      return i

    })
  }

  return {
    props: {
      items: [],
      errors
    },
  }
}
