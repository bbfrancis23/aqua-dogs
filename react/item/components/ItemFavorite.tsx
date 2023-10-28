import { useEffect, useState } from "react"
import { Item } from "../item-types"
import { useSession } from "next-auth/react"
import { useSnackbar } from "notistack"
import { IconButton } from "@mui/material"

import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteIconBorder from '@mui/icons-material/FavoriteBorder'
import axios from "axios"


export interface ItemFavoriteProps {
  item: Item;
  openAuthDialog: () => void
}

export const ItemFavorite = (props: ItemFavoriteProps) => {

  const {openAuthDialog} = props

  const [item, setItem] = useState<Item>(props.item)

  const [isFavorite, setIsFavoirite] = useState<boolean>(false)

  const {data: session, status} = useSession()

  useEffect(() => {

    if(session){

      axios.get(`/api/items/favorite/${item.id}`).then((r) => {
        setIsFavoirite(r.data.isFavorite)
      })
    }
  }, [item, session])


  const loading = status === "loading"

  const {enqueueSnackbar} = useSnackbar()

  const handleFavorite = () => {

    if(session){


      axios.patch(`/api/items/favorite/${item.id}`).then( (r) => {
        setIsFavoirite(r.data.isFavorite)
      })

    }else{
      enqueueSnackbar("You must be a member to favor")
      openAuthDialog()
    }


  }


  return (
    <>
      <IconButton aria-label="favorite" onClick={handleFavorite} color="primary">
        { isFavorite ? <FavoriteIcon/> : <FavoriteIconBorder />}
      </IconButton>
    </>
  )
}
export default ItemFavorite


// Wait to use this when it is added back in