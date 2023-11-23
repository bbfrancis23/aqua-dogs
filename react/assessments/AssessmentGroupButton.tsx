import { Typography, ButtonGroup, Button, Box, SxProps } from "@mui/material"
import { AssessmentTypes, AssessmentValues } from "./assessment-types"
import { useContext } from "react"
import { ItemContext } from "../item"
import axios from "axios"
import { ProjectContext } from "../project/ProjectContext"
import { useSnackbar } from "notistack"
import { BoardContext } from "../board"

export interface AssessmentGroupButtonsProps { type: AssessmentTypes}

const AssessmentGroupButton = ({type}: AssessmentGroupButtonsProps) => {

  const {board, setBoard} = useContext(BoardContext)
  const {item, setItem} = useContext(ItemContext)
  const {project} = useContext(ProjectContext)
  const {enqueueSnackbar} = useSnackbar()
  const {LOW, MED, HIGH} = AssessmentValues
  const values: AssessmentValues[] = [LOW, MED, HIGH]

  const getTempratureColor = (value: AssessmentValues) => {
    switch (value) {
    case LOW: return 'primary.light'
    case MED: return 'primary.dark'
    case HIGH: return 'primary.main'
    default: return ''
    }
  }

  const saveValue = (value?: AssessmentValues) => {

    const itemDir = `/api/members/projects/${project?.id}/items/${item?.id}`
    axios.patch( itemDir, {type, value})
      .then((res) => {
        setItem(res.data.item)
        axios.get(`/api/members/projects/${project?.id}/boards/${board?.id}`).then((res) => {
          if (res.status === axios.HttpStatusCode.Ok) setBoard(res.data.board)
        })
        enqueueSnackbar(`Item ${type} updated`, {variant: "success"})
      } ).catch((error) => {
        enqueueSnackbar(error.message, {variant: "error"})
      })
  }

  return (
    <Box sx={{pb: 2, textTransform: 'capitalize',}}>
      <Typography >{type}: </Typography>
      <ButtonGroup >
        { values.map((v) => (
          <Button key={v} onClick={() => saveValue(v)}
            sx={{
              color: (item && item[type] === v) ? 'primary.contrastText' : getTempratureColor(v),
              bgcolor: (item && item[type] === v) ? getTempratureColor(v) : 'transparent'
            }} >
            {v}
          </Button>
        )) }
        { (item && item[type]) && <Button onClick={() => saveValue()} color="info">CLEAR</Button> }
      </ButtonGroup>
    </Box>
  )
}

export default AssessmentGroupButton

// QA: Brian Francis 11-22-23