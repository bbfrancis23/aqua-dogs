
import { Box, Card, CardHeader, CardContent, Stack, Chip, Typography } from "@mui/material";
import axios from "axios";

export default function ItemDetails({item}:any) {

  console.log(item)

 return (
  <Box sx={{ display: 'flex', justifyContent: 'center'}}>
    <Card>
      <CardHeader title={item.title}></CardHeader>
      <CardContent>
        <Stack spacing={1} direction='row'>
          {
            item.tags.map( (t:any) => {
              return (
                 <Chip label={t.title} color="primary" key={t.id}/>
              )
            })
          }
        </Stack>
        <Stack spacing={1} sx={{ pt: 2}}>
          {
            item.sections.map( ( s:any) => {
              return (
                <p key={s.id}>

                <Typography >
                  {s.content  }
                </Typography>
                </p>
              )
            })
          }
        </Stack>
      </CardContent>
    </Card>
  </Box>
 )
}
export async function getStaticPaths(){
   const res = await axios.get('http://localhost:5000/api/items/');
   const data = await res.data 

  const paths = data.items.map((item: any) => ({params: {itemId: item.id}}))
   return { paths, fallback: false}
   
}
export async function getStaticProps({params}: any){

  const res = await axios.get(`http://localhost:5000/api/items/${params.itemId}`);
  const data = await res.data 

  return {props: {item: data.item} }

}