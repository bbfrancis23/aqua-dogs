import { AssessmentTypes, AssessmentValues } from "@/react/assessments"
import { Button } from "@mui/material"
import { Column } from "../column-types"
import { Item } from "@/react/item"
import { useContext } from "react"
import { BoardContext } from "@/react/board"
import axios from "axios"
import { useSnackbar } from "notistack"
import { ProjectContext } from "@/react/project"

export interface AssessmentSortButtonProps {
  column: Column
  close: () => void
}

const AssessmentSortButton = ({column, close}: AssessmentSortButtonProps) => {
  const {board, setBoard} = useContext(BoardContext)
  const {project} = useContext(ProjectContext)
  const {enqueueSnackbar} = useSnackbar()

  const sortByAssessment = () => {
    const { WORTH, SIMPLICITY, PRIORITY } = AssessmentTypes
    const assessmentTypes = [PRIORITY, WORTH, SIMPLICITY]
    const { LOW, MED, HIGH } = AssessmentValues


    const calculateScore = (item: any) => assessmentTypes.reduce((score, type) => {
      if (item[type] === LOW) return score + 1
      if (item[type] === MED) return score + 2
      if (item[type] === HIGH) return score + 3
      return score
    }, 0)

    column.items.forEach((item: Item) => item.assessmentScore = calculateScore(item))
    column.items.sort((a, b) => (b.assessmentScore || 0) - (a.assessmentScore || 0))

    const newBoard = { ...board, columns: [...board.columns] }
    const colKeys = newBoard.columns.reduce((keys, c) => ({ ...keys, [c.id]: c }), {})

    axios.patch(`/api/members/projects/${project.id}/boards/${board.id}`, { boardCols: colKeys })
      .then(() => enqueueSnackbar(`Cards Reordered `, { variant: "success" }))
      .catch((e: any) => {
        console.log(e)
        enqueueSnackbar(`Error Moving Cards: ${e}`, { variant: "error" })
      })

    setBoard(newBoard)
    close()
  }

  return (
    <Button onClick={() => sortByAssessment()} color="inherit">SORT BY ASSESSMENT</Button>

  )
}

export default AssessmentSortButton