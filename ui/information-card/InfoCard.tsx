
import { Card, useTheme } from "@mui/material"

export interface InfoCardProps {
  children: JSX.Element | JSX.Element[];
}

const InfoCard = (props: InfoCardProps) => (
  <Card sx={{width: {xs: "100vw", md: "600px"}}}>
    {props.children}
  </Card>
)
export default InfoCard