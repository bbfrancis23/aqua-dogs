
import { Dispatch, SetStateAction, useState} from "react"
import axios from "axios"
import {TextField} from "@mui/material"
import { Item } from "@/interfaces/ItemInterface"

export interface ItemTitleInputProps{
  item: Item,
  setItem: Dispatch<SetStateAction<Item>>;
}

export default function ItemTitleInput(props: any){

  const {item, setItem} = props
  const [isSubmitting, setIsSubmitting] = useState(false)


  const handleTitleBlur = async (e:any) => {

    setIsSubmitting(true)

    try {

      await axios.patch(`/api/items/${item.id}`, {title: e.target.value})
        .then((res) => {
          console.log('setting item from api')
          setItem(res.data.item)
          setIsSubmitting(false)
        })
        .catch((error) => {
          console.log(error)
          setIsSubmitting(false)
        })
    } catch (e) {
      console.log(e)
      setIsSubmitting(false)
    }

    setIsSubmitting(false)

  }

  return (
    <>
      <TextField
        fullWidth
        size={"small"}
        defaultValue={item?.title}
        id="itemTitle"
        label="Title"
        sx={{mt: 1}}
        onBlur={(e:any) => handleTitleBlur(e)} disabled={isSubmitting} />
    </>
  )
}