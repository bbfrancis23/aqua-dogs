import { useState, MouseEvent} from "react"

import {Box, Button, IconButton, Menu, MenuItem, useTheme, Fade} from "@mui/material"

import Link from "next/link"
import { FxTheme } from "theme/globalTheme";
import { Board } from "@/interfaces/BoardInterface";

export interface AppBarMenuProps{
  title: string;
  id: string;
  boards: Board[];
  icon: JSX.Element;
}

export default function AppBarMenu(props: AppBarMenuProps){

  const {title, id, boards, icon} = props

  const theme: FxTheme = useTheme()

  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorElement)

  const handleClick = (event: MouseEvent<HTMLButtonElement>):void => {
    setAnchorElement(event.currentTarget)
  }

  const handleClose = ():void => setAnchorElement(null)

  return (
    <Box key={id} >
      <Button aria-controls={open ? `${id}-menu` : undefined}
        aria-haspopup="true" aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        color="inherit"
        sx={{px: 3, display: {xs: "none", md: "block"}}} >
        {title}
      </Button>
      <IconButton
        id={`${id}-button`} aria-controls={open ? `${id}-menu` : undefined}
        aria-haspopup="true" aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{display: {xs: "block", md: "none", }}} >
        {icon}
      </IconButton>

      <Menu id="fade-menu" MenuListProps={{ "aria-labelledby": "fade-button", }}
        anchorEl={anchorElement} open={open} onClose={handleClose} TransitionComponent={Fade} >
        { boards.map( (p: any) => (
          <Link href={`/categories/${p.dirId}`}
            style={{textDecoration: "none", color: theme.palette.text.primary}} key={p.id} >
            <MenuItem onClick={handleClose}>{p.title}</MenuItem>
          </Link>
        )) }
      </Menu>
    </ Box>
  )
}

// QA: Brian Francisc 8-12-23