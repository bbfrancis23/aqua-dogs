import { useState } from "react"

import db from '../../mongo/db';
import {getTag, getTags} from "../../mongo/controllers/tagsControllers"
import {getItemsByTag }from "../../mongo/controllers/itemControllers"

import { Tag } from "../../interfaces/TagInterface"
import { TagItems, getTagItems } from "../../interfaces/TagItems"

import TagsComponent from "../../components/tags/TagComponent"

export interface ItemsByTagProps{
  tag: Tag;
  tagItems: TagItems[];
}


export default function ItemsByTag(props: ItemsByTagProps){

  const {tag} = props

  const [tagItems, setTagItems] = useState(props.tagItems)

  return (
    <TagsComponent tag={tag} tagItems={tagItems} />
  )
}

export const getStaticPaths = async () => {

  const tags = await getTags()


  const paths = tags.map( (t:Tag) => ({ params: { tagId: t.id } }))
  return {paths, fallback: false}
}

export const getStaticProps = async ({params}: any) => {

  const {tagId} = params
  const items = await getItemsByTag(tagId)

  const tag = await getTag(tagId)

  let tagItems: TagItems[] | [] = [];

  if(items){
    tagItems = getTagItems(tag, items)
  }

  return {props: {tag, tagItems}}

}