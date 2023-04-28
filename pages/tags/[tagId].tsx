import {Box, Card, CardHeader, Grid, Typography, useTheme} from "@mui/material"

import {getTag, getTags} from "../../mongo/controllers/tagsControllers"

import {groupItemsByTag} from "../../mongo/controllers/itemOld"

import Link from "next/link"
import { Item } from "../../interfaces/ItemInterface"
import { Tag } from "../../interfaces/TagInterface"
import TagsComponent from "../../ui/TagComponent"

export interface ItemsByTagProps{
  tag: Tag;
  tagCols: Item[];
}

export default function ItemsByTag(props: ItemsByTagProps){

  const {tag, tagCols} = props


  return (
    <TagsComponent tag={tag} tagCols={tagCols} />
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

  const tagCols: any[] = [];

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