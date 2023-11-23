import { Accordion, SxProps } from "@mui/material"
import { useState } from "react"

export interface CardAccordionProps {
  children: JSX.Element | JSX.Element []
}

const CardAccordion = ({children}: CardAccordionProps) => {

  const [exp, setExp] = useState<boolean>(false)

  const sxProps: SxProps = {
    width: '100%',
    boxShadow: 'none',
    background: 'transparent',
    fontWeight:  exp ? 'normal' : 'bold',
    '&:before': {content: 'none'}
  }

  return (
    <Accordion onChange={(e, exp) => (exp ? setExp(true) : setExp(false)) } sx={sxProps} >
      {children}
    </Accordion>
  )
}

export default CardAccordion

// QA: Brian Francis 11-22-23
