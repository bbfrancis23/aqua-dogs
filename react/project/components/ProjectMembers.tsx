import { useContext } from "react"
import { Grid, Stack } from "@mui/material"
import {ProjectMember, AddProjectMemberForm, ProjectContext} from "@/react/project"
import { Member, MemberContext } from "@/react/members"
import { Permission, PermissionCodes } from "@/fx/ui"

const ProjectMembers = () => {

  const {project} = useContext(ProjectContext)
  const {member} = useContext(MemberContext)

  const {PROJECT_LEADER, PROJECT_ADMIN, PROJECT_MEMBER} = PermissionCodes

  console.log('member', member)

  return (
    <Stack spacing={1} sx={{ pr: 3, }}>
      { member && (
        <Grid container spacing={1} sx={{ m: 0}}>
          { project?.leader && (
            <Grid item xs={12} sm={6} md={4}>
              <ProjectMember sessionMember={member} member={project.leader} type={PROJECT_LEADER} />
            </ Grid>
          )}
          <Grid container spacing={1} sx={{ m: 0}}>
            {project?.admins?.map( (m:Member) => (
              <Grid item xs={12} sm={6} md={4} key={m.id}>
                <ProjectMember member={m} type={PROJECT_ADMIN} sessionMember={member} key={m.id} />
              </Grid>
            ))}
          </Grid>
          <Grid container spacing={1} sx={{ m: 0}}>
            { project?.members?.map( (m:Member) => (
              <Grid item xs={12} sm={6} md={4} key={m.id}>
                <ProjectMember member={m} type={PROJECT_MEMBER} sessionMember={member} key={m.id} />
              </Grid>
            ))}
          </Grid>
          <Permission code={PermissionCodes.PROJECT_LEADER} project={project} member={member}>
            <Grid container spacing={1} sx={{ m: 0}}>
              <Grid item xs={12} sm={6} md={4} ><AddProjectMemberForm /></Grid>
            </Grid>
          </Permission>
        </Grid>
      ) }
    </Stack>
  )

}

export default ProjectMembers

// QA Brian Francis 10-30-23