import React from "react"
import { Box, Dialog, DialogTitle, useMediaQuery} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import DraggablePaper from "./DraggablePaper"

export interface DraggableDialogProps {
  dialogIsOpen: boolean
  ariaLabel: string
  title: string | JSX.Element
  children: JSX.Element | JSX.Element []
}

const DraggableDialog = ({dialogIsOpen, ariaLabel, title, children}: DraggableDialogProps) => {

  const theme = useTheme()
  const fullScreenQuery = useMediaQuery(theme.breakpoints.down('sm'))
  const fullScreen = Boolean(fullScreenQuery)

  const dialogProps = {
    open: dialogIsOpen,
    PaperComponent: DraggablePaper,
    'aria-labelledby': ariaLabel,
    fullScreen }

  return (
    <Dialog {...dialogProps}>
      <DialogTitle style={{ cursor: "move" }} id={ariaLabel}>
        <Box><div>{title}</div></Box>
      </DialogTitle>
      {children}
    </Dialog>
  )

}

export default DraggableDialog
// QA: Brian Francis 10-23-23