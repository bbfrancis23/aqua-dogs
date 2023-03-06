import {  Card,  CardHeader, Grid,  useTheme } from "@mui/material";

import axios from "axios";

import { ObjectId } from 'mongodb';

import Link from 'next/link'

export default function ItemsByTag(props: any){

  const {items} = props
  const theme = useTheme()

  const bestpracItems = items.filter( (i:any) => {

    const isBestPractice = i.tags.filter((t: any) => t.id === '63b0d7302beee78c4a512880' )

    if(isBestPractice.length > 0){
      return i
    }   
    
  })


  const standardItems = items.filter( (i:any) => {

    const isBestPractice = i.tags.filter((t: any) => 
      t === '63c88c117e51170d8d8c6df1'
    )

    if(isBestPractice.length > 0){
      return i
    }   
    
  })

  return (
    <Grid container spacing={3} sx={{ p: 3, pt: 12, height: '100vh'}}>
      <Grid item xs={12} md={6} lg={4} >
        <Card sx={{ height: '100%'}}>
          <CardHeader title='Best Practices' sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', }} />
            <ul>              
              {
                bestpracItems.map( (i:any, ) => (<li key={i._id}><Link href={`/items/${i._id}`} style={{textDecoration: 'none', color: theme.palette.text.primary}} >{i.title}</Link></li>))
              }
            </ul>
          </Card>
      </Grid>
      <Grid item xs={12} md={6} lg={4} >
        <Card  sx={{ height: '100%'}}>
          <CardHeader title='Standards' sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', }} />
            <ul>              
              {
                standardItems.map( (i:any, ) => (<li key={i._id}><Link href={`/items/${i._id}`} style={{textDecoration: 'none', color: theme.palette.text.primary}} >{i.title}</Link></li>))
              }
            </ul>
          </Card>
      </Grid>
      <Grid item xs={12} md={6} lg={4} >
        <Card  sx={{ height: '100%'}}>
          <CardHeader title='Examples' sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', }} />
            <ul>              
              <li>Coming soon</li>
            </ul>
          </Card>
      </Grid>
    </Grid>
  )
}
export async function getStaticPaths(){

  const res = await axios.get(`${process.env.NEXTAUTH_URL}/api/tags/`)
  
  const paths = res.data.tags.map( (t:any) => {
    return {params: {tagId: t.id}}
  })

  

  return { paths, fallback: false}
 
}
export async function getStaticProps({params}: any){  

  const  tagId  = params.tagId;

  const res = await axios.get(`${process.env.NEXTAUTH_URL}/api/items/tags/${tagId}`)



  return {props: {items: res.data.items}} 

}