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
    icon: <WebFrameworkIcon />
  },
  {
    title: "FRONTEND",
    id: "frontend",
    items: tags.slice(3, 6),
    icon: <FrontEndIcon />
  },
  {
    title: "BACKEND",
    id: "backend",
    items: tags.slice(6, 9),
    icon: <BackEndIcon />
  }

]
