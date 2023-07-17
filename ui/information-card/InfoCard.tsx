
import { Card, useTheme } from "@mui/material"

export interface InfoCardProps {
  children: JSX.Element | JSX.Element[];
}

const InfoCard = (props: InfoCardProps) => (
  <Card
    sx={{width: {xs: "100vw", md: "600px"},
      maxHeight: {xs: '93vh', md: 'calc(100vh - 160px)'}, overflow: 'auto'}}>
    {props.children}
  </Card>
)
export default InfoCard