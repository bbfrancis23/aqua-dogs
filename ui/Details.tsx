import { Box } from "@mui/material"

export interface DetailsProps {
  children: JSX.Element | JSX.Element[];
}

const Details = (props: DetailsProps) => (
  <Box sx={{display: "flex", justifyContent: "center", pt: 12}}>
    {props.children}
  </Box>
)
export default Details
