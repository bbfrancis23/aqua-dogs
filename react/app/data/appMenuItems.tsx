import {publicBoards} from "./publicBoards"
import {AppBarMenuProps} from "../components/AppBarMenu"


import WebFrameworkIcon from "@mui/icons-material/Language"
import JavaScriptIcon from "@mui/icons-material/Code"
import SoftwareDevIcon from "@mui/icons-material/DataObject"

export const appMenuItems: AppBarMenuProps[] = [
  {
    title: "WEB FRAMEWORK",
    id: "web-framework",
    boards: publicBoards.slice(0, 3),
    icon: <WebFrameworkIcon sx={{color: "primary.contrastText"}}/>
  },
  {
    title: "JAVASCRIPT",
    id: "java-script",
    boards: publicBoards.slice(3, 9),
    icon: <JavaScriptIcon sx={{color: "primary.contrastText"}}/>
  },
  {
    title: "SOFTWARE DEVELOPMENT",
    id: "softwate-dev",
    boards: publicBoards.slice(9, 12),
    icon: <SoftwareDevIcon sx={{color: "primary.contrastText"}}/>
  }

]

// QA: Brian Francis 08-23-23
