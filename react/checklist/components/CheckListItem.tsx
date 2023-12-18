import { CSSProperties } from "react"
import { Box, Checkbox, CheckboxProps, ListItem, ListItemProps } from "@mui/material"
import { Draggable} from "react-beautiful-dnd"
import { FxCheckbox, CheckBoxLabelForm } from "@/react/checklist"

export interface CheckListItemProps {
  checkbox: FxCheckbox
  index: number
  checkboxClick: (event:React.ChangeEvent<HTMLInputElement>, index: number) => void
}

const CheckListItem = ({checkbox, index, checkboxClick}: CheckListItemProps) => {

  const fixDraggableStyle: CSSProperties = { left: "auto !important", top: "auto !important" }

  const checkboxProps: CheckboxProps = {
    color: 'default',
    onChange: (e) => checkboxClick(e, index),
    size: "small",
    checked: checkbox.value
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