import {  Card,  CardHeader, Grid,  useTheme } from "@mui/material";

import axios from "axios";

import { ObjectId } from 'mongodb';
import { connectDB } from '../../lib/db';

import Link from 'next/link'

export default function ItemsByTag(props: any){

  const {items} = props
  const theme = useTheme()

  const bestpracItems = items.filter( (i:any) => {

    const isBestPractice = i.tags.filter((t: any) => t === '63b0d7302beee78c4a512880' )

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

  const paths:any  = [{ params: {tagId: '63b1d5db51a00f093850bbeb'}}]

  return { paths, fallback: false}
 
}
export async function getStaticProps({params}: any){

  const client = await connectDB();

  const db = client.db();

  const  tagId  = params.tagId;

  const items = db
    .collection('items')
    .find({ tags: new ObjectId(tagId.toString()) });

  const aItems = await items.toArray();

  const data = aItems.map( item => {
    return {
      _id: item._id.toString(),
      title: item.title,
      tags: item.tags.map( (t:any) => { return t.toString()}),
      sections: item.sections.map( (s:any) => { return s.toString()}),
    }
  })

  return {props: {items: data}} 

}