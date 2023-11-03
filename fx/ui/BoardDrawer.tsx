import { Box, Drawer, Typography } from "@mui/material"

import { Board } from "@/react/board"

import { Item, getCardDirectory } from "@/react/item"

import { HoverLink } from "@/fx/ui"

export interface BoardDrawerProps {
  board: Board
  baseUrl?: string
  children?: JSX.Element | JSX.Element []
}

const BoardDrawer = ({board, children, baseUrl}: BoardDrawerProps) => {

  const getDirectory = (i: Item) => {
    if(baseUrl){
      return `/${baseUrl}${i.id}`
    }else{
      return getCardDirectory(board, i)
    }
  }

  return (
    <Drawer
      sx={{
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: '240px',
          boxSizing: 'border-box',
        },
        width: '240px',
        display: {xs: 'none', sm: 'flex'},
      }}
      variant={"permanent"}
      anchor="left"
    >
      <Box sx={{ mt: 8}} >
        { board?.columns.map((c) =>
          (
            <Box key={c.id}>
              <Box >
                <Typography sx={{p: 2, bgcolor: 'secondary.main', color: 'secondary.contrastText'}}>
                  {c.title}
                </Typography>
              </Box>
              <Box sx={{p: 2}}>
                { c.items.map( (i: any) => (
                  <HoverLink href={getDirectory( i)} title={i.title} key={i.id} />
                ) ) }
              </ Box>
            </ Box>
          )
        )
        }
      </Box>
      {children}
    </Drawer>
  )
}

export default BoardDrawer