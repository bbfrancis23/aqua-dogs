import { Board } from "@/interfaces/BoardInterface";
import { Column } from "@/interfaces/Column";
import { Item } from "@/interfaces/ItemInterface";
import { Member } from "@/interfaces/MemberInterface";
import { Project } from "@/interfaces/ProjectInterface";
import { Box, Button,
  ButtonGroup, FormControl, IconButton, InputLabel, OutlinedInput, Stack } from "@mui/material";
import { useSnackbar } from "notistack";
import { Dispatch, SetStateAction, useState } from "react";
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';

// import * as Yup from "yup"
import SectionStub from "../SectionStub";

export interface CreateSectionFormProps {
  project: Project;
  member: Member;
  setItem: Dispatch<SetStateAction<Item>>;
}

// const createSectionSchema = Yup.object().shape({
//   content: Yup.string().required('Section Content is required'),
// })

import dynamic from "next/dynamic"
import "@uiw/react-textarea-code-editor/dist.css"
const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  {ssr: false}
)

const CreateSectionForm = (props: CreateSectionFormProps) => {
  const {project, member, setItem} = props;

  const {enqueueSnackbar} = useSnackbar()

  const [displayForm, setDisplayForm] = useState<boolean>(false)
  const [code, setCode] = useState("")

  const [sectionType, setSectionType] = useState("text")

  return (
    <>
      {
        displayForm && (
          <Stack spacing={3} sx={{ width: '100%'}}>
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
                <>

                  <FormControl variant="outlined" sx={{ width: '100%'}}>
                    <InputLabel htmlFor={'new-section'}>New Section</InputLabel>
                    <OutlinedInput
                      id={'new-section'}
                      multiline
                      rows={4}
                      defaultValue={''}

                      label={`New Section`}
                      sx={{width: '100%'}}
                    />
                  </FormControl>

                </>
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

                    padding={15}
                    style={{
                      width: '100%',
                      fontSize: 12,
                      backgroundColor: "#f5f5f5",
                      fontFamily:
                  "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace"
                    }}
                  />

                </ Box>
              )
            }
            <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>

              <IconButton>
                <CheckIcon />
              </IconButton>
              <IconButton onClick={() => setDisplayForm(false)}>
                <CancelIcon />
              </IconButton>
            </Box>
          </Stack>
        )
      }


      {
        ! displayForm && (
          <Box sx={{ width: '100%'}}
            onClick={() => setDisplayForm(true)}
          >
            <SectionStub />
          </Box>
        )
      }
    </>
  )
}

export default CreateSectionForm