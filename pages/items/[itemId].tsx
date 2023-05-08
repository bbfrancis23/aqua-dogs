import {useEffect, useMemo, useState} from "react"


import {useSnackbar} from "notistack"
import "@uiw/react-textarea-code-editor/dist.css"
import {Item} from "../../interfaces/ItemInterface"
import {getItems, getItem} from "../../mongo/controllers/itemControllers"
import FormModes from "../../enums/FormModes"
import ItemComponent from "../../components/items/ItemComponent"


export interface ItemDetailsProps{
  item: Item;
  errors: string[];
  openAuthDialog: () => void
}

const ItemDetails = (props: ItemDetailsProps) => {

  const { openAuthDialog, errors, item} = props
  const {enqueueSnackbar} = useSnackbar()

  useEffect(
    () => errors.forEach( (e:any) => enqueueSnackbar(
      `Error: ${e}`, {variant: "error"}
    )),
    [errors, enqueueSnackbar]
  )


  return (
    <ItemComponent item={item} openAuthDialog={openAuthDialog}/>
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