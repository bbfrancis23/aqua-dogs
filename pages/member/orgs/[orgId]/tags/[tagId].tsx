import { getSession } from "next-auth/react"
import { getMember } from "../../../../../mongo/controllers/memberControllers"
import { getOrg } from "../../../../../mongo/controllers/orgControllers"
import TagsComponent from "../../../../../ui/TagComponent"
import { getTag } from "../../../../../mongo/controllers/tagsControllers"

export default function OrgItemsByTag(props: any){

  const {authSession, tag, org} = props
  const tagCols: [] = []

  return (
    <TagsComponent tag={tag} tagCols={tagCols} />
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
        id: result.member.id
      }

    }else{
      return {redirect: {destination: "/", permanent: false}}
    }
  }else{
    return {redirect: {destination: "/", permanent: false}}
  }

  const tag = await getTag(context.query.tagId)

  const org = await getOrg(context.query.orgId)

  return {props: {authSession, tag, org} }
}