import { Box, Button, Menu, MenuItem } from "@mui/material";
import { useRef, useState } from "react";

import Fade from '@mui/material/Fade';

import Link from 'next/link'


export default function AppBarMenu(props: any){

  const {name, id, pages} = props

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
        sx={{ px: 3, color: 'primary.contrastText'}}
      >
        {name}
      </Button>
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
              <MenuItem key={p.id} onClick={handleClose}><Link href={`http://localhost:3000/tags/${p.tagId}`} style={{textDecoration: 'none'}} >{p.title}</Link></MenuItem>
            )
          })
        }
      </Menu>
    </ Box>
  )
}