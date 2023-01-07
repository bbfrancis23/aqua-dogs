import dbConnect from "../lib/dbConnect";
import Image from 'next/image'
import Tags from "../models/Tags";
import TagTypes from '../models/TagTypes'
import useSWR from 'swr'
import axios from "axios";
import { Box, Grid, Card, CardHeader, CardActions, Button, CardMedia } from "@mui/material";

import { SnackbarProvider, VariantType, useSnackbar } from 'notistack';

export default function Home() {

  const { enqueueSnackbar } = useSnackbar();


  const handleClickVariant = (variant: VariantType) => () => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar('This is a success message!', { variant });
  };
  return (
    
    <>
    <Button onClick={handleClickVariant('success')}>Show success snackbar</Button>
     <Grid container spacing={3}>
        <Grid item xs={12} md={8} lg={4} >
          <Card >
            <CardHeader title='JavaScript'>          </CardHeader>
            <CardMedia>
              <div style={{ position: 'relative', width: '100%', height: '300px' }}>
                <Image alt="javascript" src={'/images/card-dogs/javascript.jpg'} layout="fill" objectFit="cover" />
              </div>
            </CardMedia>
            <CardActions>
              <Button>Standards</Button>
              <Button>Best Practices</Button>
              <Button>Examples</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={8} lg={4} >
          <Card >
            <CardHeader title='HTML'></CardHeader>
            <CardMedia>
              <div style={{ position: 'relative', width: '100%', height: '300px' }}>
                <Image alt="javascript" src={'/images/card-dogs/html.jpg'} layout="fill" objectFit="cover" />
              </div>
            </CardMedia>
            <CardActions>
              <Button>Standards</Button>
              <Button>Best Practices</Button>
              <Button>Examples</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={8} lg={4} >
          <Card >
            <CardHeader title='CSS'></CardHeader>
            <CardMedia>
              <div style={{ position: 'relative', width: '100%', height: '300px' }}>
                <Image alt="javascript" src={'/images/card-dogs/css.jpg'} layout="fill" objectFit="cover" />
              </div>
            </CardMedia>
            <CardActions>
              <Button>Standards</Button>
              <Button>Best Practices</Button>
              <Button>Examples</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={8} lg={4} >
          <Card >
            <CardHeader title='React'></CardHeader>
            <CardMedia>
              <div style={{ position: 'relative', width: '100%', height: '300px' }}>
                <Image alt="javascript" src={'/images/card-dogs/react.jpg'} layout="fill" objectFit="cover" />
              </div>
            </CardMedia>
            <CardActions>
              <Button>Standards</Button>
              <Button>Best Practices</Button>
              <Button>Examples</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={8} lg={4} >
          <Card >
            <CardHeader title='NextJS'></CardHeader>
            <CardMedia>
              <div style={{ position: 'relative', width: '100%', height: '300px' }}>
                <Image alt="javascript" src={'/images/card-dogs/nextjs.jpg'} layout="fill" objectFit="cover" />
              </div>
            </CardMedia>
            <CardActions>
              <Button>Standards</Button>
              <Button>Best Practices</Button>
              <Button>Examples</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={8} lg={4} >
          <Card >
            <CardHeader title='Material User Interface'></CardHeader>
            <CardMedia>
              <div style={{ position: 'relative', width: '100%', height: '300px' }}>
                <Image alt="javascript" src={'/images/card-dogs/mui.jpg'} layout="fill" objectFit="cover" />
              </div>
            </CardMedia>
            <CardActions>
              <Button>Standards</Button>
              <Button>Best Practices</Button>
              <Button>Examples</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={8} lg={4} >
          <Card >
            <CardHeader title='NodeJS'></CardHeader>
            <CardMedia>
              <div style={{ position: 'relative', width: '100%', height: '300px' }}>
                <Image alt="javascript" src={'/images/card-dogs/nodejs.jpg'} layout="fill" objectFit="cover" />
              </div>
            </CardMedia>
            <CardActions>
              <Button>Standards</Button>
              <Button>Best Practices</Button>
              <Button>Examples</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={8} lg={4} >
          <Card >
            <CardHeader title='Express'></CardHeader>
            <CardMedia>
              <div style={{ position: 'relative', width: '100%', height: '300px' }}>
                <Image alt="javascript" src={'/images/card-dogs/express.jpg'} layout="fill" objectFit="cover" />
              </div>
            </CardMedia>
            <CardActions>
              <Button>Standards</Button>
              <Button>Best Practices</Button>
              <Button>Examples</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={8} lg={4} >
          <Card >
            <CardHeader title='MongoDB'></CardHeader>
            <CardMedia>
              <div style={{ position: 'relative', width: '100%', height: '300px' }}>
                <Image alt="javascript" src={'/images/card-dogs/mongodb.jpg'} layout="fill" objectFit="cover" />
              </div>
            </CardMedia>
            <CardActions>
              <Button>Standards</Button>
              <Button>Best Practices</Button>
              <Button>Examples</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </>
     
    
  )
}
export async function getStaticProps() {
  // await dbConnect();

  // make some changes 

  // const tags = Tags.find({})
  //   .populate({ path: "tagtype", model: TagTypes })
  //   .exec((error, list) => {
  //     console.log(error);
  //     console.log(list)
  //   });

  // console.log(tags)

  
  // try{
  //   let response = await axios.get('http://localhost:5000/api/tag-types');
  //   let to_return = await response.data;
  //   console.log(to_return);
  // }catch{

  // }


  return{
    props: {
      tags: {}
    }
  }
}