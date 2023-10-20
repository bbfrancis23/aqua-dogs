import { Box, LinearProgress } from "@mui/material";

const Loading = () => (
  <Box sx={{ width: '100%' }}>
    <LinearProgress variant={'indeterminate'} />
  </Box>
)

export default Loading