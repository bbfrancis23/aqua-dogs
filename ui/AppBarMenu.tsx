import { Box, Button, IconButton, Menu, MenuItem } from "@mui/material";
import { useRef, useState } from "react";

import Fade from '@mui/material/Fade';

import Link from 'next/link'

import SettingsIcon from '@mui/icons-material/Settings'


export default function AppBarMenu(props: any){

  const {name, id, pages,  icon} = props

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
          pages.map( (p:any) => {

            

            return(
              <MenuItem key={p.tagId} onClick={handleClose}><Link href={`http://localhost:3000/tags/${p.tagId}`} style={{textDecoration: 'none'}} >{p.title}</Link></MenuItem>
            )
          })
        }
      </Menu>
    </ Box>
  )
}