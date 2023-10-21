import WebFrameworkIcon from "@mui/icons-material/Language"
import JavaScriptIcon from "@mui/icons-material/Code"
import SoftwareDevIcon from "@mui/icons-material/DataObject"

import {WebsiteBoards} from "./WebsiteBoards"
import {AppBarMenuItem} from "../"
export const appMenuItems: AppBarMenuItem[] = [
  {
    title: "WEB FRAMEWORK",
    id: "web-framework",
    boards: WebsiteBoards.slice(0, 3),
    icon: <WebFrameworkIcon sx={{color: "primary.contrastText"}}/>
  },
  {
    title: "JAVASCRIPT",
    id: "java-script",
    boards: WebsiteBoards.slice(3, 9),
    icon: <JavaScriptIcon sx={{color: "primary.contrastText"}}/>
  },
  {
    title: "SOFTWARE DEVELOPMENT",
    id: "softwate-dev",
    boards: WebsiteBoards.slice(9, 12),
    icon: <SoftwareDevIcon sx={{color: "primary.contrastText"}}/>
  }

]

// QA: Brian Francis 10-20-23
