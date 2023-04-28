import { Box, Card, CardHeader, Grid, Typography, useTheme } from "@mui/material";
import { Item } from "../interfaces/ItemInterface";
import { Tag } from "../interfaces/TagInterface";


import Link from "next/link"

export interface TagComponentProps {
  tag: Tag ;
  tagCols: Item[] | [];
}

const TagsComponent = (props: TagComponentProps) => {
  const {tag, tagCols} = props
  const theme = useTheme()

  let medCols = 12;
  let lgCols = 12;


  if(tagCols.length === 2){
    lgCols = 6
  }else if(tagCols.length > 2){
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

export default TagsComponent