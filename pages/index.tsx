import Image from 'next/image'
import { Grid, Card, CardHeader, CardActions, Button, CardMedia, styled, useTheme } from "@mui/material";
import { useSession} from 'next-auth/react'
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


export default function Home() {

  const theme = useTheme();

  const { data: session, status } = useSession()
  const loading = status === "loading"

  return (
     <Grid container spacing={3} sx={{ p: 3, pt: 12}}>
        <Grid item xs={12} md={6} lg={4} >
          <Link href="http://localhost:3000/tags/63b1d5db51a00f093850bbeb">
             <Card >
            <CardHeader title='JavaScript' sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', }} />
            <CardMedia>
              <ThemeOverlay 
                style={{
                  background: 'url("/images/card-dogs/javascript.jpg")',      
                  backgroundPosition: 'center',   
                }}
               /> 
              
            </CardMedia>
            <CardActions>
              <Button >Standards</Button>
              <Button>Best Practices</Button>
              <Button>Examples</Button>
            </CardActions>
          </Card>
          </Link>
         
        </Grid>
        <Grid item xs={12} md={6} lg={4} >
          <Card >
            <CardHeader title='HTML'sx={{ bgcolor: 'primary.main', color: 'primary.contrastText'}} />
            <CardMedia>
            <ThemeOverlay 
                style={{
                  background: 'url("/images/card-dogs/html.jpg")',      
                  backgroundPosition: 'center',   
                }}
               /> 
            </CardMedia>
            <CardActions>
              <Button>Standards</Button>
              <Button>Best Practices</Button>
              <Button>Examples</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4} >
          <Card >
            <CardHeader title='CSS'sx={{ bgcolor: 'primary.main', color: 'primary.contrastText'}} />
            <CardMedia>
            <ThemeOverlay 
                style={{
                  background: 'url("/images/card-dogs/css.jpg")',      
                  backgroundPosition: 'center',   
                }}
               /> 
            </CardMedia>
            <CardActions>
              <Button>Standards</Button>
              <Button>Best Practices</Button>
              <Button>Examples</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4} >
          <Card >
            <CardHeader title='React'sx={{ bgcolor: 'primary.main', color: 'primary.contrastText'}} />
            <CardMedia>
            <ThemeOverlay 
                style={{
                  background: 'url("/images/card-dogs/react.jpg")',      
                  backgroundPosition: 'center',   
                }}
               /> 
            </CardMedia>
            <CardActions>
              <Button>Standards</Button>
              <Button>Best Practices</Button>
              <Button>Examples</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4} >
          <Card >
            <CardHeader title='NextJS'sx={{ bgcolor: 'primary.main', color: 'primary.contrastText'}} />
            <CardMedia>
            <ThemeOverlay 
                style={{
                  background: 'url("/images/card-dogs/nextjs.jpg")',      
                  backgroundPosition: 'center',   
                }}
               /> 
            </CardMedia>
            <CardActions>
              <Button>Standards</Button>
              <Button>Best Practices</Button>
              <Button>Examples</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4} >
          <Card >
            <CardHeader title='Material User Interface'sx={{ bgcolor: 'primary.main', color: 'primary.contrastText'}} />
            <CardMedia>
            <ThemeOverlay 
                style={{
                  background: 'url("/images/card-dogs/mui.jpg")',      
                  backgroundPosition: 'center',   
                }}
               /> 
            </CardMedia>
            <CardActions>
              <Button>Standards</Button>
              <Button>Best Practices</Button>
              <Button>Examples</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4} >
          <Card >
            <CardHeader title='NodeJS'sx={{ bgcolor: 'primary.main', color: 'primary.contrastText'}} />
            <CardMedia>
            <ThemeOverlay 
                style={{
                  background: 'url("/images/card-dogs/nodejs.jpg")',      
                  backgroundPosition: 'center',   
                }}
               /> 
            </CardMedia>
            <CardActions>
              <Button>Standards</Button>
              <Button>Best Practices</Button>
              <Button>Examples</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4} >
          <Card >
            <CardHeader title='Express'sx={{ bgcolor: 'primary.main', color: 'primary.contrastText'}} />
            <CardMedia>
            <ThemeOverlay 
                style={{
                  background: 'url("/images/card-dogs/express.jpg")',      
                  backgroundPosition: 'center',   
                }}
               /> 
            </CardMedia>
            <CardActions>
              <Button>Standards</Button>
              <Button>Best Practices</Button>
              <Button>Examples</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4} >
          <Card >
            <CardHeader title='MongoDB'sx={{ bgcolor: 'primary.main', color: 'primary.contrastText'}} />
            <CardMedia>
            <ThemeOverlay 
                style={{
                  background: 'url("/images/card-dogs/mongodb.jpg")',      
                  backgroundPosition: 'center',   
                }}
               /> 
            </CardMedia>
            <CardActions>
              <Button>Standards</Button>
              <Button>Best Practices</Button>
              <Button>Examples</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
     
    
  )
}
export async function getStaticProps() {
  // await dbConnect();

  // make some changes 

  // const tags = Tags.find({})
  //   .populate({ path: "tagtype", model: TagTypes })
  //   .exec((error, list) => {
  //   });

  
  // try{
  //   let response = await axios.get('http://localhost:5000/api/tag-types');
  //   let to_return = await response.data;
  // }catch{

  // }


  return{
    props: {
      tags: {}
    }
  }
}