import { Grid, Card, CardHeader, CardMedia, CardContent } from "@mui/material";
import {ColorOverlayImg} from "../ui/ColorOverlayImg";

import Link from 'next/link'

import { tags } from '../data/homePageTags';
import { Tag} from '../interfaces/Tag'

export default function Home() {  

  return (
     <Grid container spacing={3} sx={{ p: 3, pt: 12}}>
      { tags.map( (t: Tag) =>   (            
        <Grid item xs={12} md={6} lg={4} key={t.id}>
          <Card >
          <Link 
            href={`/tags/${t.id}`} 
            style={{textDecoration: 'none'}} 
          >
            <CardHeader title={t.title} sx={{ bgcolor: 'primary.main', color: 'primary.contrastText'}} />
          </Link>
            <CardMedia>
              { t.imgTitle && (
                <ColorOverlayImg
                  img={`/images/card-dogs/${t.imgTitle.toLowerCase()}.jpg`}
                  height='300px'
                  width='100%'
                />             
              )}                  
            </CardMedia>
            <CardContent style={{ height: '175px', overflow: 'auto', paddingBottom: '0px'}}>
            {t.sections && t?.sections.map( (s: string) => (<p key={s}>{s}</p>))}      
            </CardContent>      
          </Card>
        </Grid>
      ))}   
    </Grid>  
  )
}

// QA done