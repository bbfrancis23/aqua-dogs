import {Box, Card, CardHeader, Grid, Typography, useTheme} from "@mui/material"

import {getTag, getTags} from "../../mongo/controllers/tagsControllers"

import {groupItemsByTag} from "../../mongo/controllers/itemOld"

import Link from "next/link"
import { Item } from "../../interfaces/ItemInterface"

export default function ItemsByTag(props: any){

  const {tag, tagCols} = props
  const theme = useTheme()

  let medCols = 12;
  let lgCols = 12;


  if(tagCols.length === 2){
    lgCols = 6
  }else if(tagCols > 2){
    medCols = 6
    lgCols = 4
  }


  return (
    <Box sx={{mt: 8, p: 3}}>
      <Typography
        variant={'h1'}
        sx={{ fontWeight: '800', pl: 3, fontSize: '3rem'}}
        gutterBottom={true}
      >
        {tag.title}
      </Typography>
      <Grid container spacing={3} sx={{ height: "100%"}}>
        {
          tagCols.length === 0 && (
            <Typography sx={{pl: 7, pt: 4}}>Content Comming soon.</Typography>
          )
        }
        {
          tagCols.map((tc:any) => (
            <Grid item xs={12} md={medCols} lg={lgCols} key={tc.id}>
              <Card sx={{height: "100%"}}>
                <CardHeader
                  title={tc.title}
                  sx={{bgcolor: "primary.main", color: "primary.contrastText",}} />
                <ul>{
                  tc.items.map( (i:any, ) => (
                    <li key={i.id}>
                      <Link
                        href={`/items/${i.id}`}
                        style={{textDecoration: "none", color: theme.palette.text.primary}} >
                        {i.title}
                      </Link>
                    </li>)
                  )
                }</ul>
              </Card>
            </Grid>
          ))
        }

      </Grid>
    </Box>
  )
}

export const getStaticPaths = async () => {

  const tags = await getTags()
  const paths = tags.map( (t:any) => ({ params: { tagId: t.id } }))

  return {paths, fallback: false}

}

export const getStaticProps = async ({params}: any) => {

  const {tagId} = params
  const result = await groupItemsByTag(tagId)

  const tag = await getTag(tagId)

  const tagCols:any = [];

  if(result.items){
    result.items.forEach( (i: Item) => {
      if(i.tags){
        i.tags.forEach( (t: any) => {
          if(t.id !== tagId){

            let found = false
            let index: number | null = null
            tagCols.forEach( (tc:any, tcIndex: number) => {
              if(tc.id === t.id){
                found = true;
                index = tcIndex
              }
            })

            if(!found){
              tagCols.push({id: t.id, title: t.title, items: [i]})
            }else{
              if(index !== null){

                tagCols[index].items.push(i)
              }
            }


          }
        })
      }
    })
  }

  return {props: {tag, tagCols}}

}