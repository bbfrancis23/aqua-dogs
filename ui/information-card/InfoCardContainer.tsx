
import { FxThemeContext } from "@/fx/theme";
import { Box, useTheme } from "@mui/material"
import { useContext } from "react";

export interface InfoCardContainerProps {
  children: JSX.Element | JSX.Element[];
}

const InfoCardContainer = (props: InfoCardContainerProps) => {

  const {fxTheme} = useContext(FxThemeContext)

  return (
    <Box sx={{display: "flex", justifyContent: "center",
      pt: {xs: 0, md: fxTheme.theme.pageContentTopPadding} }}>
      {props.children}
    </Box>
  )
}
export default InfoCardContainer
// TODO: Delete this after update public item page