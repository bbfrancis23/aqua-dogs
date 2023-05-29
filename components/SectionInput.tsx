import {useState, useMemo} from "react"

import {Button, IconButton, FormControl, InputLabel, OutlinedInput, Stack,
  InputAdornment, ButtonGroup, Box} from "@mui/material"

import {useSnackbar} from "notistack"
import axios from "axios"
import DeleteIcon from "@mui/icons-material/Delete"

import dynamic from "next/dynamic"
import "@uiw/react-textarea-code-editor/dist.css"
const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  {ssr: false}
)


export default function SelectionInput(props: any){

  const {enqueueSnackbar} = useSnackbar()
  const {item, setItem, index, section} = props
  const [sectionType, setSectionType] = useState("text")
  const [code, setCode] = useState("")

  useMemo(
    () => {
      if(section.sectiontype === "63b2503c49220f42d9fc17d9") setSectionType("text")
      else{
        setSectionType("code")
        setCode(section.content)
      }
    }, [section]
  )

  const handleDeleteSection = (id: string) => {
    try {
      axios.delete(`/api/sections/${id}`)
        .then((res) => setItem(res.data.item))
        .catch((error) => console.log(error))
    } catch (e) { console.log(e) }
  }

  const handleSectionBlur = ( event: any, section: any ) => {
    try {
      axios.patch(
        `/api/sections/${section.id}`,
        { content: event.target.value, sectiontype: sectionType === "text"
          ? "63b2503c49220f42d9fc17d9" : "63b88d18379a4f30bab59bad", } )
        .then((res) => setItem(res.data.item) )
        .catch((e:any) => { enqueueSnackbar( e, {variant: "error"} ) })
    } catch (e:any) { enqueueSnackbar( e, {variant: "error"} ) }
  }

  return (


    <Stack spacing={3}>
      <ButtonGroup>
        <Button
          variant={sectionType === "text" ? "contained" : "outlined"}
          onClick={() => setSectionType("text")}
        >
          T
        </Button>
        <Button
          variant={sectionType === "code" ? "contained" : "outlined"}
          onClick={() => setSectionType("code")}
        >
          {"{}"}
        </Button>
      </ButtonGroup>
      {
        sectionType === "text" && (

          <FormControl variant="outlined" >
            <InputLabel htmlFor={section.id}>{`Section ${index + 1}`}</InputLabel>
            <OutlinedInput
              id={section.id}
              multiline
              rows={4}
              defaultValue={item.sections[index]?.content}
              onBlur={(e) => handleSectionBlur(
                e, section
              )}
              endAdornment={ (index === 0 && item.sections.length === 1) ? "" :
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
        sectionType === "code" && (
          <Box sx={{ display: 'flex', }}>
            <CodeEditor
              value={code}
              language="jsx"
              placeholder=""
              onChange={(evn) => setCode(evn.target.value)}
              onBlur={(e) => handleSectionBlur(
                e, section
              )}
              padding={15}
              style={{
                width: '100%',
                fontSize: 12,
                backgroundColor: "#f5f5f5",
                fontFamily:
                  "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace"
              }}
            />
            <IconButton edge="end" onClick={() => handleDeleteSection(section.id)}>
              <DeleteIcon />
            </IconButton>
          </ Box>
        )
      }
    </Stack>
  )
}