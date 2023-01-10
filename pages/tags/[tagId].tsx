import { Button, Card, CardActions, CardHeader, CardMedia, Grid, styled } from "@mui/material";
import axios from "axios";

import Link from 'next/link'

export const ThemeOverlay = styled('div')(

  ({ theme }) => (
    { 
      position: 'relative', 
      width: '100%', 
      height: '300px',
      display: 'flex',
      backgroundPosition: 'center',

      '&::before' :  {
         content: '""',
         background: theme.palette.secondary.main,
         width: '100%',
         height: '300px',
         opacity: '.4',
         transition: '.5s ease'
      }
    }
  )
)


export default function ItemsByTag(props: any){

  const {items} = props

  const bestpracItems = items.filter( (i:any) => {

    const isBestPractice = i.tags.filter((t: any) => 
      t === '63b0d7302beee78c4a512880'
    )

    if(isBestPractice){
      return i
    }
    
    
  })

  console.log(bestpracItems)

  return (
    <Grid container spacing={3} sx={{ p: 3, pt: 12}}>
      <Grid item xs={12} md={6} lg={4} >
        <Card >
          <CardHeader title='Best Practices' sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', }} />
            <ul>              
              {
                bestpracItems.map( (i:any, ) => (<li key={i._id}><Link href={`/items/${i._id}`} >{i.title}</Link></li>))
              }
            </ul>
          </Card>
      </Grid>
    </Grid>
  )
}
export async function getStaticPaths(){

  const paths:any  = [{ params: {tagId: '63b1d5db51a00f093850bbeb'}}]

  return { paths, fallback: false}
 
}
export async function getStaticProps({params}: any){

  const res = await axios.get(`http://localhost:3000/api/items/tags/${params.tagId}`);

  // console.log(res.data)  
  //const data = await res.data 

  return {props: {items: res.data.data}} 

}