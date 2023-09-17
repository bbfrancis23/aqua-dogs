import InfoPageLayout from "@/ui/InfoPageLayout";
import { Box, LinearProgress, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function Loading() {
  // // You can add any UI inside Loading, including a Skeleton.
  // return (
  //   <InfoPageLayout title={
  //     <Skeleton><Typography
  // sx={{p: 5, pl: 2, fontSize: {xs: '2rem', sm: '3rem'}, width: '100%' }}
  //       variant={'h2'} noWrap >
  //       Loading....
  //     </Typography></Skeleton>
  //   }>
  //     <>loading content</>
  //   </InfoPageLayout>
  // )

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress variant="determinate" value={progress} />
    </Box>
  );
}