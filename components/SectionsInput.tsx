import { Button, IconButton, FormControl, InputLabel, Select, TextField, Dialog, DialogTitle, OutlinedInput, Stack, Box, InputAdornment,
  DialogContent,DialogActions, SelectChangeEvent, MenuItem, useTheme } from "@mui/material"
import { useState } from "react"

import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";

export default function SelctionsInupt(props: any){

  const {item, setItem} = props

  const [ itemSections, setItemSections] = useState([{id: '-1', content: ''}])
  const [ sectionsNewId, setSectionsNewId] = useState( 2)

  const handleAddSection = () => {
    setItemSections( current => [...current, { id: `-${sectionsNewId}`, content: ''}])
    setSectionsNewId(current => (++current))
  }
 
  const handleDeleteSection = (id: string) => {
    setItemSections( current => {

      if(current.length  === 1) return current

      return current.filter( c => c.id !== id)
    })
  }

  async function createSection(section: any) {
    
    if(item.id) {

      try {
        axios.post('http://localhost:5000/api/sections', 
        {sectiontype: "63b2503c49220f42d9fc17d9", content: section.content, itemId: item.id})
        .then((res) => {
          setItem(res.data.item)

          const oldID = section.id

          // setItemSections( (current) => {
          //   return current.map( (s) =>  s.id === section.id ? { id: } )
          // } )

          // setIsSubmitting(false)
        })
        .catch((error) => {
          console.log(error)
          // setIsSubmitting(false)
        })
      } catch (e) {
        console.log(e)
        // setIsSubmitting(false)
      }
    }

    
  
  } 



  const handleSectionBlur = async (event: any, section: any) => {

    // console.log('blur :', event.target.value, section)

    section.content = event.target.value
    if(section.id > 0){
      console.log('this has been saved we need to update it')
    }else{
      await createSection(section)
    }

    console.log(section)
    
    

  }

  return (
    <>
      {
        itemSections.map( (s, i) => (     

          <FormControl  variant="outlined" key={i} >
            <InputLabel htmlFor={s.id}>{`Section ${i + 1}`}</InputLabel>
            <OutlinedInput
              id={s.id}
              multiline 
              rows={4}
              onBlur={(e) => handleSectionBlur(e, s)}
              disabled={!item.id}
              endAdornment={ (i === 0 && itemSections.length === 1)  ? '' :
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => handleDeleteSection(s.id)}>
                      <DeleteIcon />
                  </IconButton>
                </InputAdornment>
              }
            label={`Section ${i + 1}`}
          />
         </FormControl>

       
       )) 
      }
      <Box sx={{ display: 'flex', justifyContent: 'right'}}> 
        <IconButton onClick={handleAddSection} ><AddIcon /></IconButton>  
      </Box>
    </>
  )
}