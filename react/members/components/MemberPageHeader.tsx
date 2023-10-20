import { Avatar, Stack, Typography } from "@mui/material"
import { useContext } from "react"
import { MemberContext } from "../MemberContext"


export const MemberPageTitle = () => (
  <Typography sx={{p: 5, pl: {sm: 2, md: 0}, fontSize: {xs: '2rem', sm: '3rem'}, width: '100%' }}
    variant={'h2'} noWrap >
      Member Info
  </Typography>
)

const MemberPageHeader = () => {

  const {member} = useContext(MemberContext)

  console.log("MemberPageHeader: member: ", member)

  return (
    <Stack direction={'row'}>
      {member.image && (
        <Avatar src={member.image} sx={{ height: 100, width: 100, mt: 3, mr: 3}} />
      )}
      <MemberPageTitle />
    </ Stack>
  )
}

export default MemberPageHeader
