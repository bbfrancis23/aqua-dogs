import React from "react"
import { Box, Dialog, DialogTitle} from "@mui/material"
import DraggablePaper from "./DraggablePaper"

export interface DraggableDialogProps {
  dialogIsOpen: boolean;
  ariaLabel: string;
  title: string;
  children: JSX.Element | JSX.Element [];
  fullWidth?: boolean
}

export default function DraggableDialog(props: DraggableDialogProps) {
  const { dialogIsOpen, ariaLabel, title, children, fullWidth } = props

  return (
    <Dialog open={dialogIsOpen} PaperComponent={DraggablePaper} aria-labelledby={ariaLabel}
      fullWidth={fullWidth} >
      <DialogTitle style={{cursor: "move"}} id={ariaLabel}>
        <Box><div>{title}</div></Box>
      </DialogTitle>
      {children}
    </Dialog>
  )
}

// QA: Brian Francis 08-06-23