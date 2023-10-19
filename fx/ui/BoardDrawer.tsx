import { Board } from "@/react/board"
import { getCardDirectory } from "@/react/item";
import { HoverLink } from "@/ui/components";
import { Box, Drawer, Typography } from "@mui/material";

export interface BoardDrawerProps {
  board: Board
  children?: JSX.Element | JSX.Element [];
}

const BoardDrawer = ({board, children}: BoardDrawerProps) => {

  console.log('BoardDrawer', board)

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
            <>
              <Box key={c.id} >
                <Typography sx={{p: 2, bgcolor: 'secondary.main', color: 'secondary.contrastText'}}>
                  {c.title}
                </Typography>
              </Box>
              <Box sx={{p: 2}}>
                { c.items.map( (i: any) => (
                  <HoverLink href={getCardDirectory(board, i)} title={i.title} key={i.id} />
                ) ) }
              </ Box>
            </>
          )
        )
        }
      </Box>
      {children}
    </Drawer>
  )
}

export default BoardDrawer