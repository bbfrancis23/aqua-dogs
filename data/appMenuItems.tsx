import {tags} from "./homePageTags"
import AppBarMenu, {AppBarMenuProps} from "../components/AppBarMenu"


import WebFrameworkIcon from "@mui/icons-material/Language"
import FrontEndIcon from "@mui/icons-material/Code"
import BackEndIcon from "@mui/icons-material/DataObject"

export const appMenuItems: AppBarMenuProps[] = [
  {
    title: "WEB FRAMEWORK",
    id: "web-framework",
    items: tags.slice(0, 3),
    icon: <WebFrameworkIcon sx={{color: "primary.contrastText"}}/>
  },
  {
    title: "JAVASCRIPT",
    id: "frontend",
    items: tags.slice(3, 9),
    icon: <FrontEndIcon sx={{color: "primary.contrastText"}}/>
  },
  {
    title: "SOFTWARE DEVELOPMENT",
    id: "backend",
    items: tags.slice(9, 12),
    icon: <BackEndIcon sx={{color: "primary.contrastText"}}/>
  }

]
