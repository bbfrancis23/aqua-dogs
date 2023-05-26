import { getSession } from "next-auth/react"
import { getMember } from "../../../mongo/controllers/memberControllers"
import { getTag } from "../../../mongo/controllers/tagsControllers"
import { TagItems, getTagItems } from "../../../interfaces/TagItems"
import { getItemsByTag } from "../../../mongo/controllers/itemControllers"
import { useState } from "react"
import TagsComponent from "../../../components/tags/TagComponent"
import { resetServerContext } from "react-beautiful-dnd"

export default function MemberItemsByTag(props: any){

  const {authSession, tag, member} = props

  const [tagItems, setTagItems] = useState(props.tagItems)

  return (
    <TagsComponent tag={tag} tagItems={tagItems} member={member} />
  )


}

export const getServerSideProps = async (context: any) => {
  const authSession = await getSession({req: context.req})

  if(!authSession){
    return {redirect: {destination: "/", permanent: false}}
  }

  let member: any = {}

  if(authSession.user && authSession.user.email){
    const result = await getMember(authSession.user.email)
    if(result.member){
      member = {
        email: result.member.email,
        name: result.member.name,
        roles: result.member.roles,
        id: result.member.id,
        tags: result.member.tags
      }

    }else{


      return {redirect: {destination: "/", permanent: false}}
    }
  }else{

    return {redirect: {destination: "/", permanent: false}}
  }

  const tag = await getTag(context.query.tagId)

  let tagItems: TagItems[] | [] = [];

  const items = await getItemsByTag(context.query.tagId)

  if(items){
    tagItems = getTagItems(tag, items)
  }

  resetServerContext()

  return {props: {authSession, tag, tagItems, member} }
}