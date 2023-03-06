
import { useState } from "react"
import axios from "axios";
import { TextField } from "@mui/material"

export default function ItemTitleInput(props: any){

  const {item, setItem} = props
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleTitleBlur = async (e:any) => {   

    setIsSubmitting(true)  
      
      try {

        axios.patch(`${process.env.NEXTAUTH_URL}/api/items/${item.id}`, {title: e.target.value})
        .then((res) => {
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
      <TextField fullWidth size={'small'} defaultValue={item?.title} id="itemTitle" label='Title' sx={{ mt: 1}}  onBlur={(e:any) => handleTitleBlur(e)} disabled={isSubmitting} />                         
    </>
  )
}