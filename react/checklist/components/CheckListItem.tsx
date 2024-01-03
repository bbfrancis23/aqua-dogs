import { CSSProperties, use, useContext, useEffect, useMemo, useState } from "react"
import { Box, Checkbox, CheckboxProps, ListItem, ListItemProps } from "@mui/material"
import { Draggable} from "react-beautiful-dnd"
import { FxCheckbox, CheckBoxLabelForm } from "@/react/checklist"
import { ProjectContext } from "@/react/project"
import { BoardContext } from "@/react/board"
import { SectionContext } from "@/react/section"
import { ItemContext } from "@/react/item"
import axios from "axios"
import { useSnackbar } from "notistack"

export interface CheckListItemProps {
  checkbox: FxCheckbox
  index: number

}

const CheckListItem = ({checkbox, index}: CheckListItemProps) => {

  const [checked, setChecked] = useState<boolean>(checkbox.value)


  const {project} = useContext(ProjectContext)
  const {board, setBoard} = useContext(BoardContext)
  const {item, setItem} = useContext(ItemContext)
  const {section} = useContext(SectionContext)

  const {enqueueSnackbar} = useSnackbar()

  const fixDraggableStyle: CSSProperties = { left: "auto !important", top: "auto !important" }

  const cbClick = (event:React.ChangeEvent<HTMLInputElement>) => {

    const newChecked = !checked
    setChecked(newChecked)

    const secDir = `/api/members/projects/${project?.id}/items/${item?.id}/sections/${section?.id}`

    axios.patch(
      `${secDir}/checkboxes/${checkbox.id}`,
      {value: newChecked} )
      .then((res) => {


        if (res.status === axios.HttpStatusCode.Ok ){
          setItem(res.data.item)
          axios.get(`/api/members/projects/${project?.id}/boards/${board?.id}`).then((res) => {
            if (res.status === axios.HttpStatusCode.Ok) setBoard(res.data.board)
          })
        }
      })
      .catch((e) => {
        enqueueSnackbar(e.response.data.message, {variant: "error"})
      })
  }


  const checkboxProps: CheckboxProps = {
    color: 'default',
    onChange: (e) => cbClick(e),
    size: "small",
    checked
  }

  return (
    <Draggable key={checkbox.id} draggableId={checkbox.id} index={index}>
      {(provided) => {
        return(
          <ListItem ref={provided.innerRef}
            {...provided.draggableProps} {...provided.dragHandleProps}
            disablePadding
            sx={{'& .MuiBox-root': { width: '100%' }}}
            style={{ ...provided.draggableProps.style, ...fixDraggableStyle }}
          >
            <Box key={index} sx={{display: 'flex'}}>
              <Checkbox {...checkboxProps}/>
              <CheckBoxLabelForm checkbox={checkbox} />
            </Box>
          </ListItem>
        )
      }}
    </Draggable>
  )
}

export default CheckListItem

// QA Brian Francis 12-18-23