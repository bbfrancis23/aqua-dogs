import { Box } from "@mui/material"
import { appMenuItems } from "../data/appMenuItems"
import AppBarMenu, { AppBarMenuItem } from "./AppBarMenu"

const AppBarMenuItems = () => (
  <Box sx={{display: 'flex'}}>
    { appMenuItems.map( (i: AppBarMenuItem) => (
      <AppBarMenu key={i.id} appBarMenuIem={i}/> )) }
  </ Box>
)

export default AppBarMenuItems