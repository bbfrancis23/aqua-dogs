import { useState } from "react";
import { Button, IconButton, FormControl, InputLabel, Select, TextField, Dialog, DialogTitle, OutlinedInput, Stack, Box, InputAdornment,
  DialogContent,DialogActions, SelectChangeEvent, MenuItem, useTheme, ButtonGroup } from "@mui/material"


import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";



import dynamic from "next/dynamic";
import "@uiw/react-textarea-code-editor/dist.css";
const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  { ssr: false }
);


export default function SelectionInput(props: any){

  const {item, setItem, index, section} = props

  const [ sectionType, setSetionType] = useState('text')

  const [code, setCode] = useState('')

  const handleDeleteSection = (id: string) => {
    try {
      axios.delete(`http://localhost:5000/api/sections/${id}`)
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

 


  const handleSectionBlur = async (event: any, section: any) => {

    try {
      axios.patch(`http://localhost:5000/api/sections/${section.id}`, {
        content: event.target.value,
        sectiontype: sectionType === 'text' ?  '63b2503c49220f42d9fc17d9' : '63b88d18379a4f30bab59bad',
      })
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
          <>
             <CodeEditor
              value={code}
              language="jsx"
              placeholder=""
              onChange={(evn) => setCode(evn.target.value)}
              onBlur={(e) => handleSectionBlur(e, section)}
              padding={15}
              style={{
                fontSize: 12,
                backgroundColor: "#f5f5f5",
                fontFamily:
                  "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace"
              }}
            />
          </>
        )
    }
  </Stack>

       
     
    
  )

}