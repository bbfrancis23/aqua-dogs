import React from "react"
import { Box, Dialog, DialogTitle, useMediaQuery, useTheme} from "@mui/material"
import DraggablePaper from "./DraggablePaper"

export interface DraggableDialogProps {
  dialogIsOpen: boolean;
  ariaLabel: string;
  title: string | JSX.Element
  children: JSX.Element | JSX.Element [];
  fullWidth?: boolean
}

export default function DraggableDialog(props: DraggableDialogProps) {
  const { dialogIsOpen, ariaLabel, title, children, fullWidth } = props

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog open={dialogIsOpen} PaperComponent={DraggablePaper} aria-labelledby={ariaLabel}
      fullWidth={fullWidth} maxWidth={'md'} fullScreen={fullScreen}>
      <DialogTitle style={{cursor: "move"}} id={ariaLabel}>
        <Box><div>{title}</div></Box>
      </DialogTitle>
      {children}
    </Dialog>
  )
}

// QA: Brian Francis 09-05-23