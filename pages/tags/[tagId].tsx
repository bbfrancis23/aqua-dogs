import {getTag, getTags} from "../../mongo/controllers/tagsControllers"
import {getItemsByTag }from "../../mongo/controllers/itemControllers"

import { Tag } from "../../interfaces/TagInterface"
import { TagItems, getTagItems } from "../../interfaces/TagItems"

import TagComponent from "../../components/tags/TagComponent"
import { resetServerContext } from "react-beautiful-dnd";

export const draggableDnDMagic = () => {
  resetServerContext()
}

export interface ItemsByTagProps{
  tag: Tag;
  tagItems: TagItems[];
}

export default function ItemsByTag(props: ItemsByTagProps){

  const {tag, tagItems} = props


  return (
    <TagComponent tag={tag} tagItems={tagItems} />
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

  draggableDnDMagic()

  return {props: {tag, tagItems}}

}

