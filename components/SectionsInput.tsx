import { Button, IconButton, FormControl, InputLabel, Select, TextField, Dialog, DialogTitle, OutlinedInput, Stack, Box, InputAdornment,
  DialogContent,DialogActions, SelectChangeEvent, MenuItem, useTheme, ButtonGroup } from "@mui/material"
import { useEffect, useState } from "react"

import AddIcon from '@mui/icons-material/Add';
import axios from "axios";
import SectionInput from "./SectionInput";

export default function SectionsInupt(props: any){

  const {item, setItem} = props

 
  const [ newSectionOrderNumber, setNewSectionOrderNumber] = useState( 2)

 

  const handleAddSection = () => {

    console.log('adding section')
    
    try {
      axios.post('http://localhost:3000/api/sections', 
      {sectiontype: "63b2503c49220f42d9fc17d9", content: '', itemId: item.id, order:  newSectionOrderNumber})
      .then((res) => {

        setNewSectionOrderNumber(c => ++c)
        setItem(res.data.item)
      })
      .catch((error) => {
        console.log(error)
      })
    } catch (e) {
      console.log(e)
    }
    
  }
 
 

  return (
    <>
       {
        item?.sections?.map( (s:any, i:number) => (  
          <SectionInput key={i} index={i} section={s} item={item} setItem={setItem} />
          )) 
        }  
      <Box sx={{ display: 'flex', justifyContent: 'right'}}> 
        <IconButton onClick={handleAddSection} ><AddIcon /></IconButton>  
      </Box>
      
    </>
  )
}