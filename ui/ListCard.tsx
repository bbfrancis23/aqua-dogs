import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material"

export interface ListCardProps {
  title: string | JSX.Element
  children: JSX.Element | JSX.Element [];
}

export const ListCard = ({title, children}: ListCardProps) => (
  <Card >
    <CardHeader sx={{ bgcolor: "secondary.main",}}
      title={title}
    />
    <CardContent style={{height: "175px", overflow: "auto", paddingBottom: "0px"}}>
      {children}
    </CardContent>
  </Card>
)

export default ListCard