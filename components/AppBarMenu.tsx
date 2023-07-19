import {useState} from "react"

import {Box, Button, IconButton, Menu, MenuItem, useTheme, Fade} from "@mui/material"

import Link from "next/link"
import {Tag} from "../interfaces/TagInterface"

export interface AppBarMenuProps{
  title: string;
  id: string;
  items: Tag[];
  icon: JSX.Element;
}

export default function AppBarMenu(props: AppBarMenuProps){

  const {title, id, items, icon} = props

  const theme = useTheme()

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => setAnchorEl(null)

  return (
    <Box key={id} >
      <Button
        aria-controls={open ? `${id}-menu` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{px: 3, color: "primary.contrastText", display: {xs: "none", sm: "block"}}}
      >
        {title}
      </Button>
      <IconButton
        id={`${id}-button`}
        aria-controls={open ? `${id}-menu` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{display: {xs: "block", sm: "none", color: "primary.contrastText"}}}
      >
        {icon}
      </IconButton>

      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {
          items.map( (p: Tag) => (
            <Link
              href={`/tags/${p.id}`}
              style={{textDecoration: "none", color: theme.palette.text.primary}} key={p.id}
            >
              <MenuItem onClick={handleClose}>{p.title}</MenuItem>
            </Link>
          ))
        }
      </Menu>
    </ Box>
  )
}