import { useState } from "react";

import { getSession } from "next-auth/react";

import { Box, Card, CardContent, CardHeader, Divider, IconButton, List, Stack,
  Typography } from "@mui/material"

import AddOrgIcon from "@mui/icons-material/Add"

import OrgTitleForm from "../../../components/org/forms/OrgTitleForm";
import AddOrgMemberForm from "../../../components/org/forms/AddOrgMemberForm";
import MemberListItem from "../../../components/members/MemberListItem";

import Details from "../../../ui/Details"
import Permission from "../../../ui/Permission";

import { getOrg } from '../../../mongo/controllers/orgControllers';
import { getMember } from "../../../mongo/controllers/memberControllers";

import PermissionCodes from "../../../enums/PermissionCodes";

import { Org } from "../../../interfaces/OrgInterface";

export interface MemberOrgProps {
  org: Org;
  setOrg: () => void
}

export default function MemberOrgPage(props: MemberOrgProps){

  const [org, setOrg] = useState(props.org)


  return (
    <Details>
      <Card sx={{width: {xs: "100vw", md: "50vw"}}}>
        <CardHeader
          title={<OrgTitleForm org={org}/>}
          action={
            <Permission roles={[PermissionCodes.ORG_LEADER, PermissionCodes.ORG_ADMIN]} org={org}>
              <IconButton><AddOrgIcon /></IconButton>
            </Permission>
          }
        />
        <CardContent sx={{pl: 1}}>
          <Box sx={{ display: 'flex', pb: 1}}>
            <Typography variant={'h5'} sx={{ pl: 3, }}>Members:</Typography>
            <Permission roles={[PermissionCodes.ORG_LEADER, PermissionCodes.ORG_ADMIN]} org={org}>
              <AddOrgMemberForm org={org} setOrg={(o:any) => setOrg(o)}/>
            </Permission>
          </Box>
          <Stack spacing={3} sx={{ pl: 3}}>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              { org.leader && (
                <MemberListItem member={org.leader} type={PermissionCodes.ORG_LEADER}
                  org={org} setOrg={setOrg} />
              )}
              {org.admins?.map( (m:any) => (
                <>
                  <Divider variant="inset" component="li" />
                  <MemberListItem member={m} type={PermissionCodes.ORG_ADMIN}
                    org={org} setOrg={setOrg}/>
                </>
              ))}
              { org.members?.map( (m:any) => (
                <>
                  <Divider variant="inset" component="li" />
                  <MemberListItem member={m} type={PermissionCodes.ORG_MEMEBER}
                    org={org} setOrg={setOrg}/>
                </>
              ))}
            </List>
          </Stack>
        </CardContent>
      </Card>
    </Details>
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

  return {props: {authSession, org}}
}