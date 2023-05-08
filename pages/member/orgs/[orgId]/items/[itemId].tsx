import { useSnackbar } from "notistack";
import { Item } from "../../../../../interfaces/ItemInterface";
import ItemComponent from "../../../../../components/items/ItemComponent";
import { getSession } from "next-auth/react";
import { getMember } from "../../../../../mongo/controllers/memberControllers";
import { Org } from "../../../../../interfaces/OrgInterface";
import { getOrg } from "../../../../../mongo/controllers/orgControllers";
import { getItem } from "../../../../../mongo/controllers/itemControllers";

export interface OrgItemDetailsProps{
  item: Item;
  errors: string[];
  openAuthDialog: () => void;
  org: Org;
}


const OrgItemDetails = (props: OrgItemDetailsProps) => {

  const { errors, item, openAuthDialog, org} = props
  const {enqueueSnackbar} = useSnackbar()

  return (
    <ItemComponent item={item} openAuthDialog={openAuthDialog} org={org}/>
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

  const org = await getOrg(context.query.orgId)

  let item: any = null
  const errors = []

  try {
    item = await getItem(context.query.itemId)
  } catch (e) { errors.push(e) }

  return {props: {authSession, org, errors, item} }
}

export default OrgItemDetails