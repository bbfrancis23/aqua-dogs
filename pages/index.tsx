import Image from 'next/image'
import { Grid, Card, CardHeader, CardActions, Button, CardMedia, styled, useTheme, CardContent } from "@mui/material";
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


export default function Home(props: any) {

  const {tags} = props

  const theme = useTheme();

  const { data: session, status } = useSession()
  const loading = status === "loading"

  return (
     <Grid container spacing={3} sx={{ p: 3, pt: 12}}>

      {
        tags.map( (t: any) =>
          (
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
                <CardContent style={{ height: '175px', overflow: 'auto'}}>
                 {
                  t.sections.map( (s: string) => (<p key='s'>{s}</p>))
                 }      
                </CardContent>      
              </Card>
            </Grid>
          )
        )
      }
   
      </Grid>
     
    
  )
}
export async function getStaticProps() {
  


  return{
    props: {
      tags: [
        { 
          tagId: '63b1d5db51a00f093850bbeb', 
          title: 'JavaScript',
          imgTitle: 'javascript',
          sections: [
            'JavaScript is the most popular programming language in the world.',
            'Javascript is the programming language for the Web Framework.'
          ]

        },
        { 
          tagId: '63c9b8e6f01b17156211eb01', 
          title: 'HTML',
          imgTitle: 'html',
          sections: [
            'HTML - HyperText Markup Language.',
            'HTML is the modeling language for the Web Framework.'
          ]
        },
        { 
          tagId: '63c9ba02f01b17156211eb03', 
          title: 'CSS',
          imgTitle: 'css',
          sections: [
            'CSS - Cascading Style Sheets.',
            'CSS is the Styling language for the Web Framework.'
          ]
        },
        { 
          tagId: '63c9ba02f01b17156211eb03', 
          title: 'React',
          imgTitle: 'react',
          sections: [
            'React is a Javascript library for making front-end user interfaces.',
            'React is the most popular Javascript library in the world. It is primaryly concerned with state managment.'
          ]
        },
        { 
          tagId: '63c9bae9f01b17156211eb06', 
          title: 'NextJS',
          imgTitle: 'nextjs',
          sections: [
            'NextJS is a Javascript Framework for making FullStack applications using React.',
            'NextJS makes it possible to make static websites with React.'
          ]
        },
        { 
          tagId: '63c9bb1ff01b17156211eb07', 
          title: 'Material User Interface',
          imgTitle: 'mui',
          sections: [
            'MUI - Matrial User Interface. Is a React Framework for building components.',
            'MUI is based on the Material Specification.'
          ]
        },
        { 
          tagId: '63c9bb52f01b17156211eb08', 
          title: 'NodeJS',
          imgTitle: 'nodeJS',
          sections: [
            'NodeJS is a JavaScript cross-platform, open-source server environment',
            'NodeJS allows you to write server code in JavaScript.'
          ]
        },
        { 
          tagId: '63c9bb5ff01b17156211eb09', 
          title: 'ExpressJS',
          imgTitle: 'express',
          sections: [
            'ExpressJS is a backend NodeJS framework for building RESTful APIs',
          ]
        },
        { 
          tagId: '63c9bb6cf01b17156211eb0a', 
          title: 'MognoDB',
          imgTitle: 'mongodb',
          sections: [
            'MongoDB is a NoSQL database program.',
            'MongoDB uses JSON documents with optional schemas.'
          ]
        },
       
      ]
    }
  }
}