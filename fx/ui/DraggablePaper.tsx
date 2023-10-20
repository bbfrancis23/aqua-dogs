import React from "react"

import Draggable from "react-draggable"

import {Paper} from "@mui/material"

export default function DraggablePaper(props: any) {
  const {"aria-labelledby": labelId} = props,

    nodeRef = React.useRef(null)

  return (
    <Draggable
      nodeRef={nodeRef}
      handle={`#${labelId}`}
      cancel='[class*="MuiDialogContent-root"]'
    >
      <Paper ref={nodeRef} {...props} />
    </Draggable>
  )
}

// QA: Brian Francis 08/22/23