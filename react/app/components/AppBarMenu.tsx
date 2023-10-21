import { useState, MouseEvent, useContext} from "react"
import Link from "next/link"
import {Box, Button, IconButton, Menu, MenuItem, Fade} from "@mui/material"
import { Board } from "@/react/board"
import { FxThemeContext } from "@/fx/theme"
export interface AppBarMenuItem{
  title: string;
  id: string;
  boards: Board[];
  icon: JSX.Element;
}
export interface AppBarMenuProps{
  appBarMenuIem: AppBarMenuItem;
}

export default function AppBarMenu(props: AppBarMenuProps){

  const {appBarMenuIem} = props
  const {fxTheme} = useContext(FxThemeContext)

  const [anchorEl, setAnchorElement] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const doClick = (event: MouseEvent<HTMLButtonElement>):void => {
    setAnchorElement(event.currentTarget)
  }

  const doClose = ():void => setAnchorElement(null)

  const btnCtrls = open ? `${appBarMenuIem.id}-menu` : undefined
  const exp = open ? "true" : undefined
  const txtBtnSx = {px: 3, display: {xs: "none", md: "block"}, color: 'inherit'}
  const icnBtnSx = {display: {xs: "block", md: "none" }}
  const menuList = { "aria-labelledby": "fade-button"}

  return (
    <Box key={appBarMenuIem.id} >
      <Button aria-controls={btnCtrls} aria-expanded={exp} onClick={doClick} sx={txtBtnSx} >
        {appBarMenuIem.title}
      </Button>
      <IconButton aria-controls={btnCtrls} aria-expanded={exp} onClick={doClick} sx={icnBtnSx} >
        {appBarMenuIem.icon}
      </IconButton>
      <Menu MenuListProps={menuList} anchorEl={anchorEl} open={open} onClose={doClose} >
        { appBarMenuIem.boards.map( (p: any) => (
          <Link href={`/categories/${p.dirId}`}
            style={{textDecoration: "none", color: fxTheme.theme.palette.text.primary}} key={p.id} >
            <MenuItem onClick={doClose}>{p.title}</MenuItem>
          </Link>
        )) }
      </Menu>
    </ Box>
  )
}

// QA: Brian Francisc 10-20-23