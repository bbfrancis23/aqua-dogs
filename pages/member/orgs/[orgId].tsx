import {
  Avatar, Badge, Box, Button, Card, CardContent, CardHeader,
  Divider,
  Icon,
  IconButton,
  List, ListItem, ListItemAvatar, ListItemText, Stack, Tooltip, Typography, } from "@mui/material"
import Details from "../../../ui/Details"

import AddIcon from "@mui/icons-material/Add"

import { getOrg } from '../../../mongo/controllers/orgControllers';
import OrgTitleForm from "../../../components/org/forms/OrgTitleForm";
import LeaderIcon from '@mui/icons-material/Star';
import AdminIcon from '@mui/icons-material/AutoAwesome';
import DeleteIcon from '@mui/icons-material/Delete';
import { getSession } from "next-auth/react";
import { getMember } from "../../../mongo/controllers/memberControllers";
import Permission from "../../../ui/Permission";
import PermissionCodes from "../../../enums/PermissionCodes";
import AddMemberIcon from '@mui/icons-material/PersonAdd';

export default function MemberOrgPage(props:any){

  const {org, authSession, member} = props

  const getAvatar = (m: any) => {
    let avatar = '';
    if(m.name){
      const names = member.name.split(' ')

      const firstInitial = names[0].charAt(0);
      const secondInitial = names[1] ? names[1].charAt(0) : '';
      avatar = [firstInitial, secondInitial].join('')
    }else{
      avatar = m.email.charAt(0)
    }
    return avatar
  }

  const handleOpenDialog = (mode: string) => {
    console.log(mode)
  }

  return (
    <Details>
      <Card sx={{width: {xs: "100vw", md: "50vw"}}}>
        <CardHeader
          title={<OrgTitleForm title={org.title} id={org.id} org={org}/>}
          action={
            <Permission roles={[PermissionCodes.ORG_LEADER, PermissionCodes.ORG_ADMIN]} org={org}>
              <IconButton onClick={() => handleOpenDialog("ADD") }><AddIcon /></IconButton>
            </Permission> }
        />
        <CardContent sx={{pl: 1}}>
          <Box sx={{ display: 'flex'}}>
            <Typography variant={'h5'} sx={{ pl: 3}}>Members:</Typography>
            <Permission roles={[PermissionCodes.ORG_LEADER, PermissionCodes.ORG_ADMIN]} org={org}>

              <Tooltip title="Add Member">
                <IconButton size="small" sx={{ ml: 1}}>
                  <AddMemberIcon />
                </IconButton>
              </Tooltip>
            </Permission>
          </Box>


          <Stack spacing={3} sx={{ pl: 3}}>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={ <LeaderIcon color="primary" fontSize="small" /> } >
                    <Avatar sx={{ bgcolor: 'secondary.main', width: 50, height: 50}} >
                      {getAvatar(org.leader)}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={`Leader: ${org.leader.name}`}
                  secondary={` ${org.leader.email}`}
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              {
                org.members.map( (m:any) => (
                  <ListItem
                    alignItems="flex-start"
                    key={m.id}
                    secondaryAction={
                      <Permission
                        roles={[PermissionCodes.ORG_LEADER, PermissionCodes.ORG_ADMIN]}
                        org={org}
                      >
                        <IconButton aria-label="delete">
                          <DeleteIcon />
                        </IconButton>
                        <Tooltip title="Make Admin">
                          <IconButton aria-label="make admin">
                            <AdminIcon />
                          </IconButton>
                        </Tooltip>
                      </Permission>


                    }
                  >
                    <ListItemAvatar>

                      <Avatar sx={{ bgcolor: 'secondary.main', width: 50, height: 50}} >
                        {getAvatar(m)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`Member: ${m.name}`}
                      secondary={` ${m.email}`}
                    />
                  </ListItem>
                ))
              }

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

  return {props: {authSession, member, org}}
}