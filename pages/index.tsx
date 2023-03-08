import { Grid, Card, CardHeader, CardMedia, styled, CardContent } from "@mui/material";
import Link from 'next/link'
import {ColorOverlayImg} from "../components/ColorOverlayImg";
import { tags } from '../data/tags';

export default function Home(props: any) {

  const {tags} = props 

  return (
     <Grid container spacing={3} sx={{ p: 3, pt: 12}}>

      {
        tags.map( (t: any) => {
            
          return   (            
            <Grid item xs={12} md={6} lg={4} key={t.tagId}>
              <Card >
              <Link href={`/tags/${t.tagId}`} style={{textDecoration: 'none'}} ><CardHeader title={t.title} sx={{ bgcolor: 'primary.main', color: 'primary.contrastText'}} /></Link>
                <CardMedia>
                <ColorOverlayImg
                  img={`/images/card-dogs/${t.imgTitle.toLowerCase()}.jpg`}
                  height='300px'
                  width='100%'
                />                
                </CardMedia>
                <CardContent style={{ height: '175px', overflow: 'auto', paddingBottom: '0px'}}>
                 {
                  t.sections.map( (s: string) => (<p key={s}>{s}</p>))
                 }      
                </CardContent>      
              </Card>
            </Grid>
          )
        })
      }   
    </Grid>  
  )
}
export async function getStaticProps() {
  
  // In the future we want this to come from database

  return{
    props: {
      tags: tags
    }
  }
}