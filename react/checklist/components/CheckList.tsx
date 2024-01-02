import { useContext, useEffect, useState } from "react"
import { List } from "@mui/material"
import { useSnackbar } from "notistack"
import axios from "axios"
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd"
import { ProjectContext } from "@/react/project"
import { BoardContext } from "@/react/board"
import { SectionContext, SectionTypes } from "@/react/section"
import { ItemContext } from "@/react/item"
import { FxCheckbox, CheckListItem } from "@/react/checklist"

export interface CheckListProps { checkboxes: FxCheckbox[]}

const CheckList = ({checkboxes}: CheckListProps) => {

  const {CHECKLIST} = SectionTypes
  const {project} = useContext(ProjectContext)
  const {board, setBoard} = useContext(BoardContext)
  const {item, setItem} = useContext(ItemContext)
  const {section} = useContext(SectionContext)

  const [listItems, setListItems] = useState<FxCheckbox[]>(checkboxes)

  useEffect(() => {
    if (!checkboxes) return

    setListItems(checkboxes)
  }, [checkboxes])

  const {enqueueSnackbar} = useSnackbar()
  const secDir = `/api/members/projects/${project?.id}/items/${item?.id}/sections/${section?.id}`


  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const items = Array.from(checkboxes)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setListItems(items)

    axios.patch(secDir, {checkboxes: items, sectiontype: CHECKLIST} )
      .then((res) => {
        setItem(res.data.item)
        enqueueSnackbar(`Checklist Reordered `, {variant: "success"})
      })
      .catch((e:any) => {
        console.log(e)
        enqueueSnackbar(`Error Reordering Checklist: ${e}`, {variant: "error"})
      })

  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="check-list">
        {(droppableProvided) => (
          <List {...droppableProvided.droppableProps} ref={droppableProvided.innerRef} >
            {listItems.map((cb, index) => (
              <CheckListItem key={cb.id} checkbox={cb} index={index} />
            ))}
            {droppableProvided.placeholder}
          </List>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default CheckList

// QA Brian Francis 12-18-23