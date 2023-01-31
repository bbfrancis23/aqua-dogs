import Image from 'next/image'
import { Grid, Card, CardHeader, CardActions, Button, CardMedia, styled, useTheme, CardContent } from "@mui/material";
import { useSession} from 'next-auth/react'
import Link from 'next/link'

import { tags } from '../data/tags';

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


export default function Home(props: any) {

  const {tags} = props

  const theme = useTheme();

  const { data: session, status } = useSession()
  const loading = status === "loading"

  return (
     <Grid container spacing={3} sx={{ p: 3, pt: 12}}>

      {
        tags.map( (t: any) => {

            
          return   (            
            <Grid item xs={12} md={6} lg={4} key={t.tagId}>
              <Card >
              <Link href={`http://localhost:3000/tags/${t.tagId}`} style={{textDecoration: 'none'}} ><CardHeader title={t.title} sx={{ bgcolor: 'primary.main', color: 'primary.contrastText'}} /></Link>
                <CardMedia>
                <ThemeOverlay 
                    style={{
                      background: `url("/images/card-dogs/${t.imgTitle}.jpg")`,      
                      backgroundPosition: 'center',   
                    }}
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
        }
         
        )
      }
   
      </Grid>
     
    
  )
}
export async function getStaticProps() {
  


  return{
    props: {
      tags: tags
    }
  }
}