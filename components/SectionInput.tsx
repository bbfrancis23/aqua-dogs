import { useState } from "react";
import { Button, IconButton, FormControl, InputLabel, Select, TextField, Dialog, DialogTitle, OutlinedInput, Stack, Box, InputAdornment,
  DialogContent,DialogActions, SelectChangeEvent, MenuItem, useTheme, ButtonGroup } from "@mui/material"


import CodeEditor from '@uiw/react-textarea-code-editor'
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";

export default function SelectionInput(props: any){

  const {item, setItem, index, section} = props

  const [ sectionType, setSetionType] = useState('text')


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
    
     
    <Stack spacing={3}>  
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
            <InputLabel htmlFor={section.id}>{`Section ${index + 1}`}</InputLabel>
            <OutlinedInput
              id={section.id}
              multiline 
              rows={4}
              onBlur={(e) => handleSectionBlur(e, section)}
              endAdornment={ (index === 0 && item.sections.length === 1)  ? '' :
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => handleDeleteSection(section.id)}>
                      <DeleteIcon />
                  </IconButton>
                </InputAdornment>
              }
            label={`Section ${index + 1}`}
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

       
     
    
  )

}