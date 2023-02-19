import { useState } from "react";

import { Box, Button, IconButton, Menu, MenuItem, useTheme, Fade } from "@mui/material"

import Link from 'next/link'

export default function AppBarMenu(props: any){  

  const {name, id, pages,  icon} = props

  const theme = useTheme()

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: any) => setAnchorEl(event.currentTarget)
  
  const handleClose = () => setAnchorEl(null)

  return (
    <Box>
      <Button
        id={`${id}-button`}
        aria-controls={open ? `${id}-menu` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ px: 3, color: 'primary.contrastText', display: { xs: 'none', sm: 'block'}}}
      >
        {name}
      </Button>
      <IconButton
        id={`${id}-button`}
        aria-controls={open ? `${id}-menu` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ display: {xs:'block', sm: 'none'} }}
      >
        {icon}
      </IconButton>

      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >       
        {
          pages.map( (p:any) => (
            <Link href={`/tags/${p.tagId}`} style={{textDecoration: 'none', color: theme.palette.text.primary}} key={p.tagId}  >
              <MenuItem onClick={handleClose}>{p.title}</MenuItem>
            </Link>
          ))
        }
      </Menu>
    </ Box>
  )
}