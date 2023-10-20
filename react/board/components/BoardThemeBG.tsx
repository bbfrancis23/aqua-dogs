import { FxThemeContext } from "@/fx/theme";
import { Box } from "@mui/material";
import { useContext } from "react";

interface BoardThemeBGProps {
  children: React.ReactNode
}

const BoardThemeBG = ({children}: BoardThemeBGProps) => {

  const {fxTheme} = useContext(FxThemeContext)

  return (
    <Box style={{overflow: 'hidden'}}
      sx={{background: `url(/images/themes/${fxTheme.name}/hero.jpg)`, overflow: 'hidden',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center', width: '100vw', height: 'calc(100vh - 64px)'}} >
      {children}
    </Box>
  )
}

export default BoardThemeBG