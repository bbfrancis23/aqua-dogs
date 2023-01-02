import dbConnect from "../lib/dbConnect";

import Tags from "../models/Tags";
import TagTypes from '../models/TagTypes'
import useSWR from 'swr'
import axios from "axios";

export default function Home() {
  return (
    <>
      <h1>The Home page</h1>
     </>
  )
}
export async function getStaticProps() {
  // await dbConnect();

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