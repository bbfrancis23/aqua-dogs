import { Button, IconButton, FormControl, InputLabel, Select, TextField, Dialog, DialogTitle, OutlinedInput, Stack, Box, InputAdornment,
  DialogContent,DialogActions, SelectChangeEvent, MenuItem, useTheme, ButtonGroup } from "@mui/material"
import { useEffect, useState } from "react"

import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";

export default function SelctionsInupt(props: any){

  const {item, setItem} = props

 
  const [ newSectionOrderNumber, setNewSectionOrderNumber] = useState( 2)

  const [ sectionType, setSetionType] = useState('text')

  // useEffect( () => {
  //     console.log(item)
  //   },

  // [item])

  const handleAddSection = () => {
    

    console.log(item.sections.length)  
    try {
      axios.post('http://localhost:5000/api/sections', 
      {sectiontype: "63b2503c49220f42d9fc17d9", content: '', itemId: item.id, order:  newSectionOrderNumber})
      .then((res) => {

        setNewSectionOrderNumber(c => ++c)
        console.log('res.data.item',res.data.item)
        setItem(res.data.item)
      })
      .catch((error) => {
        console.log(error)
      })
    } catch (e) {
      console.log(e)
    }
    
  }
 
  const handleDeleteSection = (id: string) => {
    try {
      axios.delete(`http://localhost:5000/api/sections/${id}`)
      .then((res) => {

        
        console.log('res.data.item',res.data.item)
        setItem(res.data.item)
      })
      .catch((error) => {
        console.log(error)
      })
    } catch (e) {
      console.log(e)
    }
    
  }

 


  const handleSectionBlur = async (event: any, section: any) => {

    console.log(event.target.value, section ) 

    try {
      axios.patch(`http://localhost:5000/api/sections/${section.id}`, {content: event.target.value})
      .then((res) => {
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
          <Stack key={i} spacing={3}>  
            <ButtonGroup>
              <Button 
                variant={sectionType === 'text' ? 'contained' : 'outlined'} 
                onClick={() => setSetionType('text')}
              >
                T
              </Button>
              <Button 
                variant={sectionType === 'code' ? 'contained' : 'outlined'}
                onClick={() => setSetionType('code')}
              >
                {'{}'}
              </Button>
            </ButtonGroup> 
            {
              sectionType == 'text' && (

                <FormControl  variant="outlined" >
                  <InputLabel htmlFor={s.id}>{`Section ${i + 1}`}</InputLabel>
                  <OutlinedInput
                    id={s.id}
                    multiline 
                    rows={4}
                    onBlur={(e) => handleSectionBlur(e, s)}
                    endAdornment={ (i === 0 && item.sections.length === 1)  ? '' :
                      <InputAdornment position="end">
                        <IconButton edge="end" onClick={() => handleDeleteSection(s.id)}>
                            <DeleteIcon />
                        </IconButton>
                      </InputAdornment>
                    }
                  label={`Section ${i + 1}`}
                />
              </FormControl>
            )           
          }
          {
             sectionType == 'code' && (
              <>code input</>
             )
          }
        </Stack>

       
       )) 
      }
      <Box sx={{ display: 'flex', justifyContent: 'right'}}> 
        <IconButton onClick={handleAddSection} ><AddIcon /></IconButton>  
      </Box>
    </>
  )
}