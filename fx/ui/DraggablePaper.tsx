import React from "react"
import Draggable from "react-draggable"
import {Paper} from "@mui/material"

export default function DraggablePaper(props: {"aria-labelledby"?: string}) {

  const {"aria-labelledby": handle} = props
  const nodeRef = React.useRef(null)

  return (
    <Draggable nodeRef={nodeRef} handle={`#${handle}`} cancel='[class*="MuiDialogContent-root"]' >
      <Paper ref={nodeRef} {...props} />
    </Draggable>
  )
}

// QA: Brian Francis 10/23/23
