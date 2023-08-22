
import { Box, useTheme } from "@mui/material"
import { FxTheme } from "../../theme/globalTheme";

export interface InfoCardContainerProps {
  children: JSX.Element | JSX.Element[];
}

const InfoCardContainer = (props: InfoCardContainerProps) => {

  const theme: FxTheme = useTheme()

  return (
    <Box sx={{display: "flex", justifyContent: "center",
      pt: {xs: 0, md: theme.pageContentTopPadding} }}>
      {props.children}
    </Box>
  )
}
export default InfoCardContainer
// TODO: Delete this after update public item page