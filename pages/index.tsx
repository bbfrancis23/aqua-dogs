import Link from 'next/link'

import { Grid, Card, CardHeader, CardMedia, CardContent } from "@mui/material";
import {ColorOverlayImg} from "../components/ColorOverlayImg";

import { tags } from '../data/tags';
import { Tag} from '../interfaces/Tag'

export default function Home(props: {tags: Tag[]}) {

  const {tags} = props 

  return (
     <Grid container spacing={3} sx={{ p: 3, pt: 12}}>

      {
        tags.map( (t: Tag) => {
            
          return   (            
            <Grid item xs={12} md={6} lg={4} key={t.id}>
              <Card >
              <Link href={`/tags/${t.id}`} style={{textDecoration: 'none'}} ><CardHeader title={t.title} sx={{ bgcolor: 'primary.main', color: 'primary.contrastText'}} /></Link>
                <CardMedia>
                  {t.imgTitle && (
                    <ColorOverlayImg
                      img={`/images/card-dogs/${t.imgTitle.toLowerCase()}.jpg`}
                      height='300px'
                      width='100%'
                    />             
                  )}                  
                </CardMedia>
                <CardContent style={{ height: '175px', overflow: 'auto', paddingBottom: '0px'}}>
                 {
                  t.sections &&
                  t?.sections.map( (s: string) => (<p key={s}>{s}</p>))
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