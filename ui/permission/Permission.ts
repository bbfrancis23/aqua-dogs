import { Member } from '../../interfaces/MemberInterface';
import { Project } from '../../interfaces/ProjectInterface';

export enum PermissionCodes {
  PROJECT_LEADER = 'ProjectLeader',
  PROJECT_ADMIN = 'ProjectAdmin',
  PROJECT_MEMBER = 'ProjectMember',
  MEMBER = 'Member',
}

const permission = (
  code: PermissionCodes,
  member: Member,
  project?: Project
): boolean => {
  let hasPermission = false;
  if (code === PermissionCodes.PROJECT_MEMBER) {
    console.log(project?.leader.id, member.id);

    if (project?.leader.id === member.id) {
      hasPermission = true;
    }
  }


  return hasPermission
};

export default permission;
