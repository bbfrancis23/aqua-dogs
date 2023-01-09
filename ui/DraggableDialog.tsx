import React from 'react'
import PropTypes from 'prop-types'
import { Box, Dialog, DialogTitle } from '@mui/material'
import DraggablePaper from './DraggablePaper'

export default function DraggableDialog(props: any) {
  const { dialogIsOpen, ariaLabel, title, children } = props

  return (
    <Dialog
      open={dialogIsOpen}
      PaperComponent={DraggablePaper}
      aria-labelledby={ariaLabel}
    >
      <DialogTitle style={{ cursor: 'move' }} id={ariaLabel}>
        <Box>
          <div>{title}</div>
        </Box>
      </DialogTitle>
      {children}
    </Dialog>
  )
}